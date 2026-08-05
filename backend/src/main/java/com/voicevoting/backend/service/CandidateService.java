package com.voicevoting.backend.service;

import com.voicevoting.backend.entity.Candidate;
import com.voicevoting.backend.repository.CandidateRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class CandidateService {

    @Autowired
    private CandidateRepository candidateRepository;

    public Candidate addCandidate(Candidate candidate) {
        return candidateRepository.save(candidate);
    }

    public long getCandidateCount() {
        return candidateRepository.count();
    }

    public List<Candidate> getAllCandidates() {
        return candidateRepository.findAll();
    }

    public Optional<Candidate> getCandidateByCandidateId(String candidateId) {
        return candidateRepository.findByCandidateId(candidateId);
    }

    public Candidate updateCandidate(String candidateId, Candidate updatedCandidate) {

        Optional<Candidate> candidate = candidateRepository.findByCandidateId(candidateId);

        if (candidate.isPresent()) {

            Candidate existing = candidate.get();

            existing.setCandidateName(updatedCandidate.getCandidateName());
            existing.setPartyName(updatedCandidate.getPartyName());
            existing.setSymbol(updatedCandidate.getSymbol());
            existing.setActive(updatedCandidate.isActive());

            return candidateRepository.save(existing);
        }

        return null;
    }

    public String deleteCandidate(String candidateId) {

        Optional<Candidate> candidate = candidateRepository.findByCandidateId(candidateId);

        if (candidate.isPresent()) {

            candidateRepository.delete(candidate.get());

            return "Candidate Deleted Successfully";
        }

        return "Candidate Not Found";
    }
}