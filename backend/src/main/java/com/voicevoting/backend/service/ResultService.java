package com.voicevoting.backend.service;

import com.voicevoting.backend.dto.ResultResponse;
import com.voicevoting.backend.entity.Candidate;
import com.voicevoting.backend.repository.CandidateRepository;
import com.voicevoting.backend.repository.VoteRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class ResultService {

    @Autowired
    private CandidateRepository candidateRepository;

    @Autowired
    private VoteRepository voteRepository;

    public List<ResultResponse> getResults() {

        List<Candidate> candidates = candidateRepository.findAll();

        List<ResultResponse> results = new ArrayList<>();

        for (Candidate candidate : candidates) {

            long voteCount = voteRepository.countByCandidateId(candidate.getCandidateId());

            results.add(
                    new ResultResponse(
                            candidate.getCandidateId(),
                            candidate.getCandidateName(),
                            candidate.getPartyName(),
                            voteCount));
        }

        return results;
    }
}