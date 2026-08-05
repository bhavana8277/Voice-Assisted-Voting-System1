package com.voicevoting.backend.repository;

import com.voicevoting.backend.entity.Voter;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface VoterRepository extends JpaRepository<Voter, Integer> {

    Optional<Voter> findByVoterId(String voterId);

}