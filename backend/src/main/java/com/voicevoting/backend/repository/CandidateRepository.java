package com.voicevoting.backend.repository;

import com.voicevoting.backend.entity.Candidate;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface CandidateRepository extends JpaRepository<Candidate, Integer> {

    Optional<Candidate> findByCandidateId(String candidateId);

}