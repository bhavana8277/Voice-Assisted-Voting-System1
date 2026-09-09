package com.voicevoting.backend.controller;

import com.voicevoting.backend.security.AuthenticatedOfficer;
import com.voicevoting.backend.service.LegacyVoteMigrationService;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/admin/migrations")
public class MigrationController {
    private final LegacyVoteMigrationService migrationService;

    public MigrationController(LegacyVoteMigrationService migrationService) {
        this.migrationService = migrationService;
    }

    @PostMapping("/encrypt-legacy-votes")
    @PreAuthorize("hasRole('ADMIN')")
    public LegacyVoteMigrationService.MigrationResult encryptLegacyVotes(Authentication authentication) {
        AuthenticatedOfficer officer = (AuthenticatedOfficer) authentication.getPrincipal();
        return migrationService.migrate(officer.officerId());
    }
}
