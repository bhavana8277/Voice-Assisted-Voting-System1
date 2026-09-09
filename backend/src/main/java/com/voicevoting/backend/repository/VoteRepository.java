package com.voicevoting.backend.repository;

import com.voicevoting.backend.entity.Vote;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface VoteRepository extends JpaRepository<Vote, Integer> {

    Optional<Vote> findByVoterId(String voterId);

}
