package com.voicevoting.backend.service;

import com.voicevoting.backend.dto.VoteRequest;
import com.voicevoting.backend.entity.Candidate;
import com.voicevoting.backend.entity.Ballot;
import com.voicevoting.backend.entity.Vote;
import com.voicevoting.backend.entity.Voter;
import com.voicevoting.backend.repository.CandidateRepository;
import com.voicevoting.backend.repository.BallotRepository;
import com.voicevoting.backend.repository.VoteRepository;
import com.voicevoting.backend.repository.VoterRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.UUID;

@Service
public class VoteService {

    private final VoteRepository voteRepository;
    private final VoterRepository voterRepository;
    private final CandidateRepository candidateRepository;
    private final BallotRepository ballotRepository;
    private final BallotEncryptionService ballotEncryptionService;

    public VoteService(VoteRepository voteRepository, VoterRepository voterRepository,
                       CandidateRepository candidateRepository, BallotRepository ballotRepository,
                       BallotEncryptionService ballotEncryptionService) {
        this.voteRepository = voteRepository;
        this.voterRepository = voterRepository;
        this.candidateRepository = candidateRepository;
        this.ballotRepository = ballotRepository;
        this.ballotEncryptionService = ballotEncryptionService;
    }

    // Cast Vote
    @Transactional
    public String castVote(VoteRequest request, String pollingOfficerId) {
        Voter voter = voterRepository.findByVoterId(request.getVoterId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Voter not found."));
        if (!voter.isActive()) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Voter is inactive.");
        }
        if (voter.isHasVoted() || voteRepository.findByVoterId(voter.getVoterId()).isPresent()) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Voter has already voted.");
        }
        Candidate candidate = candidateRepository.findByCandidateId(request.getCandidateId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Candidate not found."));
        if (!candidate.isActive()) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Candidate is inactive.");
        }

        String electionId = "DEFAULT_ELECTION";
        BallotEncryptionService.EncryptedBallot encryptedBallot =
                ballotEncryptionService.encrypt(candidate.getCandidateId(), electionId);
        ballotRepository.save(new Ballot(electionId, encryptedBallot.ciphertext(), encryptedBallot.nonce()));

        Vote vote = new Vote();
        vote.setVoterId(voter.getVoterId());
        vote.setBallotReference(UUID.randomUUID().toString());
        vote.setPollingOfficerId(pollingOfficerId);
        vote.setReceiptId(UUID.randomUUID().toString());
        voteRepository.save(vote);
        voter.setHasVoted(true);
        voterRepository.save(voter);

        return "Vote Cast Successfully";
    }

    // Get All Votes
    public List<Vote> getAllVotes() {
        return voteRepository.findAll();
    }

    // Get Vote Count by Candidate ID
    public long getVoteCount(String candidateId) {
        return ballotRepository.findByElectionId("DEFAULT_ELECTION").stream()
                .map(ballot -> ballotEncryptionService.decrypt(
                        ballot.getCiphertext(), ballot.getNonce(), ballot.getElectionId()))
                .filter(candidateId::equals)
                .count();
    }
}
