package com.voicevoting.backend.repository;

import com.voicevoting.backend.entity.AuditLog;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AuditRepository extends JpaRepository<AuditLog, Long> {

}