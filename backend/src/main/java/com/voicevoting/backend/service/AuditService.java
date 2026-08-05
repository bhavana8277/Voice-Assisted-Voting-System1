package com.voicevoting.backend.service;

import com.voicevoting.backend.entity.AuditLog;
import com.voicevoting.backend.repository.AuditRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class AuditService {

    @Autowired
    private AuditRepository repository;

    public void saveLog(String officerId,
            String action,
            String description) {

        AuditLog log = new AuditLog();

        log.setOfficerId(officerId);
        log.setAction(action);
        log.setDescription(description);
        log.setTimestamp(LocalDateTime.now());

        repository.save(log);
    }

    // Audit Count
    public long getAuditCount() {
        return repository.count();
    }

    // Get All Logs
    public List<AuditLog> getAllLogs() {
        return repository.findAll();
    }
}