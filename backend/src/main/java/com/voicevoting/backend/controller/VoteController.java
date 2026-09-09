package com.voicevoting.backend.controller;

import com.voicevoting.backend.dto.VoteRequest;
import com.voicevoting.backend.entity.Vote;
import com.voicevoting.backend.security.AuthenticatedOfficer;
import com.voicevoting.backend.service.VoteService;
import jakarta.validation.Valid;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/votes")
@CrossOrigin(origins = "*")
public class VoteController {

    private final VoteService voteService;

    public VoteController(VoteService voteService) {
        this.voteService = voteService;
    }

    // Cast Vote
    @PostMapping
    @PreAuthorize("hasAnyRole('POLLING_OFFICER', 'ADMIN')")
    public String castVote(@Valid @RequestBody VoteRequest vote, Authentication authentication) {
        AuthenticatedOfficer officer = (AuthenticatedOfficer) authentication.getPrincipal();
        return voteService.castVote(vote, officer.officerId());
    }

    // Get All Votes
    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public List<Vote> getAllVotes() {
        return voteService.getAllVotes();
    }

    // Get Vote Count for a Candidate
    @GetMapping("/count/{candidateId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'ELECTION_OFFICER')")
    public long getVoteCount(@PathVariable String candidateId) {
        return voteService.getVoteCount(candidateId);
    }
}
