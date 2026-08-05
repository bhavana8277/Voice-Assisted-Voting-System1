package com.voicevoting.backend.service;

import com.voicevoting.backend.entity.Vote;
import com.voicevoting.backend.repository.VoteRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class VoteService {

    @Autowired
    private VoteRepository voteRepository;

    // Cast Vote
    public String castVote(Vote vote) {

        Optional<Vote> existingVote = voteRepository.findByVoterId(vote.getVoterId());

        if (existingVote.isPresent()) {
            return "Voter has already voted.";
        }

        voteRepository.save(vote);

        return "Vote Cast Successfully";
    }

    // Get All Votes
    public List<Vote> getAllVotes() {
        return voteRepository.findAll();
    }

    // Get Vote Count by Candidate ID
    public long getVoteCount(String candidateId) {
        return voteRepository.countByCandidateId(candidateId);
    }
}