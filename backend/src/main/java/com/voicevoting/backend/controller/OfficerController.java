package com.voicevoting.backend.controller;

import com.voicevoting.backend.dto.OfficerLoginRequest;
import com.voicevoting.backend.dto.OfficerLoginResponse;
import com.voicevoting.backend.dto.OfficerResponse;
import com.voicevoting.backend.entity.Officer;
import com.voicevoting.backend.service.OfficerService;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/officers")
@CrossOrigin(origins = "*")
public class OfficerController {

    private final OfficerService officerService;

    public OfficerController(OfficerService officerService) {
        this.officerService = officerService;
    }

    // Register Officer
    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public OfficerResponse addOfficer(@RequestBody Officer officer) {
        return toResponse(officerService.addOfficer(officer));
    }

    @PutMapping("/{officerId}")
    @PreAuthorize("hasRole('ADMIN')")
    public OfficerResponse updateOfficer(
            @PathVariable String officerId,
            @RequestBody Officer officer) {

        return toResponse(officerService.updateOfficer(officerId, officer));
    }

    @PutMapping("/{officerId}/status")
    @PreAuthorize("hasRole('ADMIN')")
    public OfficerResponse changeStatus(
            @PathVariable String officerId,
            @RequestParam boolean active) {

        return toResponse(officerService.changeStatus(officerId, active));
    }

    // Get All Officers
    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public List<OfficerResponse> getAllOfficers() {
        return officerService.getAllOfficers().stream().map(this::toResponse).toList();
    }

    // Get Officer Count
    @GetMapping("/count")
    @PreAuthorize("hasRole('ADMIN')")
    public long getOfficerCount() {
        return officerService.getOfficerCount();
    }

    // Get Officer by Officer ID
    @GetMapping("/{officerId}")
    @PreAuthorize("hasRole('ADMIN')")
    public Optional<OfficerResponse> getOfficerByOfficerId(@PathVariable String officerId) {
        return officerService.getOfficerByOfficerId(officerId).map(this::toResponse);
    }

    // Officer Login
    @PostMapping("/login")
    public OfficerLoginResponse login(@RequestBody OfficerLoginRequest request) {
        return officerService.login(request);
    }

    private OfficerResponse toResponse(Officer officer) {
        return new OfficerResponse(officer.getOfficerId(), officer.getFullName(), officer.getRole(), officer.isActive());
    }
}
