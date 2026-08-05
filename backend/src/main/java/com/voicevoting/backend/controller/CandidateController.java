package com.voicevoting.backend.controller;

import com.voicevoting.backend.entity.Candidate;
import com.voicevoting.backend.service.CandidateService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/candidates")
@CrossOrigin(origins = "*")
public class CandidateController {

    @Autowired
    private CandidateService candidateService;

    @PostMapping
    public Candidate addCandidate(@RequestBody Candidate candidate) {
        return candidateService.addCandidate(candidate);
    }

    @GetMapping
    public List<Candidate> getAllCandidates() {
        return candidateService.getAllCandidates();
    }

    @GetMapping("/count")
    public long getCandidateCount() {
        return candidateService.getCandidateCount();
    }

    @GetMapping("/{candidateId}")
    public Optional<Candidate> getCandidateByCandidateId(@PathVariable String candidateId) {
        return candidateService.getCandidateByCandidateId(candidateId);
    }

    @PutMapping("/{candidateId}")
    public Candidate updateCandidate(
            @PathVariable String candidateId,
            @RequestBody Candidate candidate) {

        return candidateService.updateCandidate(candidateId, candidate);
    }

    @DeleteMapping("/{candidateId}")
    public String deleteCandidate(@PathVariable String candidateId) {
        return candidateService.deleteCandidate(candidateId);
    }
}