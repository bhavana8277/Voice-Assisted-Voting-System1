package com.voicevoting.backend.controller;

import com.voicevoting.backend.entity.AuditLog;
import com.voicevoting.backend.service.AuditService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/audit")
@CrossOrigin(origins = "*")
public class AuditController {

    @Autowired
    private AuditService auditService;

    @GetMapping
    public List<AuditLog> getLogs() {
        return auditService.getAllLogs();
    }

    @GetMapping("/count")
    public long getAuditCount() {
        return auditService.getAuditCount();
    }
}