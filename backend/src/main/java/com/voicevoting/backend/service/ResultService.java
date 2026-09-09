package com.voicevoting.backend.service;

import com.voicevoting.backend.dto.ResultResponse;
import com.voicevoting.backend.dto.ResultSummaryResponse;
import com.voicevoting.backend.entity.Candidate;
import com.voicevoting.backend.repository.BallotRepository;
import com.voicevoting.backend.repository.CandidateRepository;
import com.voicevoting.backend.repository.VoterRepository;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.time.LocalDateTime;

@Service
public class ResultService {

    private final CandidateRepository candidateRepository;
    private final BallotRepository ballotRepository;
    private final BallotEncryptionService ballotEncryptionService;
    private final VoterRepository voterRepository;

    public ResultService(CandidateRepository candidateRepository, BallotRepository ballotRepository,
                         BallotEncryptionService ballotEncryptionService, VoterRepository voterRepository) {
        this.candidateRepository = candidateRepository;
        this.ballotRepository = ballotRepository;
        this.ballotEncryptionService = ballotEncryptionService;
        this.voterRepository = voterRepository;
    }

    public List<ResultResponse> getResults() {

        List<Candidate> candidates = candidateRepository.findAll();
        Map<String, Long> counts = new HashMap<>();
        for (Candidate candidate : candidates) {
            counts.put(candidate.getCandidateId(), 0L);
        }
        ballotRepository.findByElectionId("DEFAULT_ELECTION").forEach(ballot -> {
            String candidateId = ballotEncryptionService.decrypt(
                    ballot.getCiphertext(), ballot.getNonce(), ballot.getElectionId());
            if (!counts.containsKey(candidateId)) {
                throw new IllegalStateException("Ballot references an unknown candidate.");
            }
            counts.compute(candidateId, (ignored, count) -> count + 1);
        });

        List<ResultResponse> results = new ArrayList<>();

        for (Candidate candidate : candidates) {

            long voteCount = counts.get(candidate.getCandidateId());

            results.add(
                    new ResultResponse(
                            candidate.getCandidateId(),
                            candidate.getCandidateName(),
                            candidate.getPartyName(),
                            voteCount));
        }

        return results;
    }

    public ResultSummaryResponse getSummary() {
        long registeredVoters = voterRepository.count();
        long ballotsCast = ballotRepository.countByElectionId("DEFAULT_ELECTION");
        long votersMarkedVoted = voterRepository.countByHasVotedTrue();
        double turnout = registeredVoters == 0 ? 0 : (ballotsCast * 100.0) / registeredVoters;

        return new ResultSummaryResponse(
                registeredVoters,
                ballotsCast,
                votersMarkedVoted,
                candidateRepository.count(),
                Math.round(turnout * 10.0) / 10.0,
                ballotsCast == votersMarkedVoted,
                LocalDateTime.now());
    }
}
