package com.voicevoting.backend.controller;

import com.voicevoting.backend.entity.Voter;
import com.voicevoting.backend.service.VoterService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/voters")
@CrossOrigin(origins = "*")
public class VoterController {

    @Autowired
    private VoterService voterService;

    @PostMapping
    public Voter addVoter(@RequestBody Voter voter) {
        return voterService.addVoter(voter);
    }

    @GetMapping("/count")
    public long getVoterCount() {
        return voterService.getVoterCount();
    }

    @GetMapping
    public List<Voter> getAllVoters() {
        return voterService.getAllVoters();
    }

    @PutMapping("/{voterId}")
    public Voter updateVoter(
            @PathVariable String voterId,
            @RequestBody Voter voter) {

        return voterService.updateVoter(voterId, voter);
    }

    @GetMapping("/{voterId}")
    public Optional<Voter> getVoter(@PathVariable String voterId) {
        return voterService.getVoterById(voterId);
    }

    @PutMapping("/{voterId}/status")
    public Voter changeStatus(
            @PathVariable String voterId,
            @RequestParam boolean active) {

        return voterService.changeStatus(voterId, active);
    }

}