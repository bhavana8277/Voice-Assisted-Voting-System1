package com.voicevoting.backend.controller;

import com.voicevoting.backend.security.AuthenticatedOfficer;
import com.voicevoting.backend.service.ElectionResetService;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/admin/election")
public class ElectionResetController {
    private final ElectionResetService electionResetService;

    public ElectionResetController(ElectionResetService electionResetService) {
        this.electionResetService = electionResetService;
    }

    @PostMapping("/reset")
    @PreAuthorize("hasRole('ADMIN')")
    public ElectionResetService.ResetResult resetElection(Authentication authentication) {
        AuthenticatedOfficer officer = (AuthenticatedOfficer) authentication.getPrincipal();
        return electionResetService.reset(officer.officerId());
    }
}
