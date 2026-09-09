package com.voicevoting.backend.repository;

import com.voicevoting.backend.entity.Voter;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

import java.util.Optional;

public interface VoterRepository extends JpaRepository<Voter, Integer> {

    Optional<Voter> findByVoterId(String voterId);

    @Modifying(flushAutomatically = true, clearAutomatically = true)
    @Query("UPDATE Voter voter SET voter.hasVoted = false")
    int resetVotingStatus();

    long countByHasVotedTrue();

}
