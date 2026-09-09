package com.voicevoting.backend.service;

import com.voicevoting.backend.entity.Ballot;
import com.voicevoting.backend.entity.Vote;
import com.voicevoting.backend.repository.BallotRepository;
import com.voicevoting.backend.repository.VoteRepository;
import com.voicevoting.backend.repository.VoterRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
public class LegacyVoteMigrationService {
    private static final String ELECTION_ID = "DEFAULT_ELECTION";
    private final VoteRepository voteRepository;
    private final VoterRepository voterRepository;
    private final BallotRepository ballotRepository;
    private final BallotEncryptionService ballotEncryptionService;
    private final AuditService auditService;

    public LegacyVoteMigrationService(VoteRepository voteRepository, VoterRepository voterRepository,
                                      BallotRepository ballotRepository,
                                      BallotEncryptionService ballotEncryptionService,
                                      AuditService auditService) {
        this.voteRepository = voteRepository;
        this.voterRepository = voterRepository;
        this.ballotRepository = ballotRepository;
        this.ballotEncryptionService = ballotEncryptionService;
        this.auditService = auditService;
    }

    @Transactional
    public synchronized MigrationResult migrate(String officerId) {
        List<Vote> legacyVotes = voteRepository.findAll().stream()
                .filter(vote -> vote.getReceiptId() != null && vote.getReceiptId().startsWith("ENCRYPTED_"))
                .toList();

        for (Vote vote : legacyVotes) {
            BallotEncryptionService.EncryptedBallot encryptedBallot = ballotEncryptionService.encrypt(
                    vote.getBallotReference(), ELECTION_ID);
            ballotRepository.save(new Ballot(ELECTION_ID, encryptedBallot.ciphertext(), encryptedBallot.nonce()));

            // Remove the voter-to-candidate link while keeping the eligibility record.
            vote.setBallotReference(UUID.randomUUID().toString());
            vote.setReceiptId(UUID.randomUUID().toString());
            voterRepository.findByVoterId(vote.getVoterId()).ifPresent(voter -> voter.setHasVoted(true));
        }

        if (!legacyVotes.isEmpty()) {
            voteRepository.saveAll(legacyVotes);
            auditService.saveLog(officerId, "MIGRATE LEGACY BALLOTS",
                    legacyVotes.size() + " legacy ballots encrypted and detached from voter records.");
        }

        return new MigrationResult(legacyVotes.size());
    }

    public record MigrationResult(int migratedVotes) {
    }
}
