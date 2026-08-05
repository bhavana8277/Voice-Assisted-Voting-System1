package com.voicevoting.backend.service;

import com.voicevoting.backend.entity.Voter;
import com.voicevoting.backend.repository.VoterRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class VoterService {

    @Autowired
    private VoterRepository voterRepository;

    public Voter addVoter(Voter voter) {

        Optional<Voter> existing = voterRepository.findByVoterId(voter.getVoterId());

        if (existing.isPresent()) {
            throw new RuntimeException("Voter ID already exists");
        }

        return voterRepository.save(voter);
    }

    public long getVoterCount() {
        return voterRepository.count();
    }

    public List<Voter> getAllVoters() {
        return voterRepository.findAll();
    }

    public Voter updateVoter(String voterId, Voter updatedVoter) {

        Optional<Voter> existing = voterRepository.findByVoterId(voterId);

        if (existing.isEmpty()) {
            throw new RuntimeException("Voter not found");
        }

        Voter voter = existing.get();

        voter.setFullName(updatedVoter.getFullName());
        voter.setAge(updatedVoter.getAge());
        voter.setGender(updatedVoter.getGender());
        voter.setAddress(updatedVoter.getAddress());
        voter.setPreferredLanguage(updatedVoter.getPreferredLanguage());
        voter.setActive(updatedVoter.isActive());

        return voterRepository.save(voter);
    }

    public Optional<Voter> getVoterById(String voterId) {
        return voterRepository.findByVoterId(voterId);
    }

    public Voter changeStatus(String voterId, boolean active) {

        Optional<Voter> existing = voterRepository.findByVoterId(voterId);

        if (existing.isEmpty()) {
            throw new RuntimeException("Voter not found");
        }

        Voter voter = existing.get();

        voter.setActive(active);

        return voterRepository.save(voter);
    }

}