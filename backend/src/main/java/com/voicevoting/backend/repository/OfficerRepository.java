package com.voicevoting.backend.repository;

import com.voicevoting.backend.entity.Officer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface OfficerRepository extends JpaRepository<Officer, Long> {

    Optional<Officer> findByOfficerId(String officerId);

}