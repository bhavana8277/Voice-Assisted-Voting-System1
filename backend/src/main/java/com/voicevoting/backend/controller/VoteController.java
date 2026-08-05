package com.voicevoting.backend.controller;

import com.voicevoting.backend.entity.Vote;
import com.voicevoting.backend.service.VoteService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/votes")
@CrossOrigin(origins = "*")
public class VoteController {

    @Autowired
    private VoteService voteService;

    // Cast Vote
    @PostMapping
    public String castVote(@RequestBody Vote vote) {
        return voteService.castVote(vote);
    }

    // Get All Votes
    @GetMapping
    public List<Vote> getAllVotes() {
        return voteService.getAllVotes();
    }

    // Get Vote Count for a Candidate
    @GetMapping("/count/{candidateId}")
    public long getVoteCount(@PathVariable String candidateId) {
        return voteService.getVoteCount(candidateId);
    }
}