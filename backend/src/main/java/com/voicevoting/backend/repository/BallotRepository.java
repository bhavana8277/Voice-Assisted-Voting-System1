package com.voicevoting.backend.repository;

import com.voicevoting.backend.entity.Ballot;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface BallotRepository extends JpaRepository<Ballot, Long> {
    List<Ballot> findByElectionId(String electionId);

    long countByElectionId(String electionId);
}
