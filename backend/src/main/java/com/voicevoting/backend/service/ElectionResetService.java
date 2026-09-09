package com.voicevoting.backend.service;

import com.voicevoting.backend.repository.BallotRepository;
import com.voicevoting.backend.repository.VoteRepository;
import com.voicevoting.backend.repository.VoterRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class ElectionResetService {
    private final VoteRepository voteRepository;
    private final BallotRepository ballotRepository;
    private final VoterRepository voterRepository;
    private final AuditService auditService;

    public ElectionResetService(VoteRepository voteRepository, BallotRepository ballotRepository,
                                VoterRepository voterRepository, AuditService auditService) {
        this.voteRepository = voteRepository;
        this.ballotRepository = ballotRepository;
        this.voterRepository = voterRepository;
        this.auditService = auditService;
    }

    @Transactional
    public synchronized ResetResult reset(String officerId) {
        long removedVotes = voteRepository.count();
        long removedBallots = ballotRepository.count();

        ballotRepository.deleteAllInBatch();
        voteRepository.deleteAllInBatch();
        int resetVoters = voterRepository.resetVotingStatus();

        auditService.saveLog(officerId, "RESET ELECTION",
                "Fresh voting session started. Removed " + removedVotes + " eligibility records and "
                        + removedBallots + " encrypted ballots; reset " + resetVoters + " voters.");

        return new ResetResult(removedVotes, removedBallots, resetVoters);
    }

    public record ResetResult(long removedVotes, long removedBallots, int resetVoters) {
    }
}
