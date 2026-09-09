package com.voicevoting.backend.service;

import com.voicevoting.backend.dto.OfficerLoginRequest;
import com.voicevoting.backend.dto.OfficerLoginResponse;
import com.voicevoting.backend.entity.Officer;
import com.voicevoting.backend.repository.OfficerRepository;
import com.voicevoting.backend.security.AuthTokenService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class OfficerService {

    private final OfficerRepository officerRepository;
    private final AuditService auditService;
    private final PythonFaceService pythonFaceService;
    private final PasswordEncoder passwordEncoder;
    private final AuthTokenService authTokenService;
    private final LocalDevelopmentAccountService localDevelopmentAccountService;

    public OfficerService(OfficerRepository officerRepository, AuditService auditService,
                           PythonFaceService pythonFaceService, PasswordEncoder passwordEncoder,
                           AuthTokenService authTokenService,
                           LocalDevelopmentAccountService localDevelopmentAccountService) {
        this.officerRepository = officerRepository;
        this.auditService = auditService;
        this.pythonFaceService = pythonFaceService;
        this.passwordEncoder = passwordEncoder;
        this.authTokenService = authTokenService;
        this.localDevelopmentAccountService = localDevelopmentAccountService;
    }

    // ===========================
    // Register Officer
    // ===========================
    public Officer addOfficer(Officer officer) {

        officer.setPassword(passwordEncoder.encode(officer.getPassword()));
        Officer saved = officerRepository.save(officer);

        auditService.saveLog(
                officer.getOfficerId(),
                "ADD OFFICER",
                officer.getFullName() + " registered as " + officer.getRole());

        return saved;
    }

    // ===========================
    // Get All Officers
    // ===========================
    public List<Officer> getAllOfficers() {
        return officerRepository.findAll();
    }

    // ===========================
    // Get Officer By ID
    // ===========================
    public Optional<Officer> getOfficerByOfficerId(String officerId) {
        return officerRepository.findByOfficerId(officerId);
    }

    // ===========================
    // Officer Login
    // ===========================
    public OfficerLoginResponse login(OfficerLoginRequest request) {

        Optional<Officer> officer = officerRepository.findByOfficerId(request.getOfficerId());

        // Officer Not Found
        if (officer.isEmpty()) {

            return new OfficerLoginResponse(
                    false,
                    "Officer not found",
                    null,
                    null,
                    null,
                    null);
        }

        Officer existingOfficer = officer.get();

        // Password Check
        if (!passwordMatches(existingOfficer, request.getPassword())) {

            return new OfficerLoginResponse(
                    false,
                    "Invalid Password",
                    null,
                    null,
                    null,
                    null);
        }

        // Role Check
        if (!existingOfficer.getRole().equalsIgnoreCase(request.getRole())) {

            return new OfficerLoginResponse(
                    false,
                    "Invalid Role Selected",
                    null,
                    null,
                    null,
                    null);
        }

        // Active Check
        if (!existingOfficer.isActive()) {

            return new OfficerLoginResponse(
                    false,
                    "Officer account is inactive",
                    null,
                    null,
                    null,
                    null);
        }

        // ===========================
        // Face Verification
        // ===========================
        boolean isLocalDevelopmentAccount = localDevelopmentAccountService
                .skipsFaceAuthentication(existingOfficer.getOfficerId());
        boolean verified = isLocalDevelopmentAccount || pythonFaceService.verifyOfficer(existingOfficer.getOfficerId());

        if (!verified) {

            auditService.saveLog(
                    existingOfficer.getOfficerId(),
                    "FACE AUTH FAILED",
                    "Officer face verification failed.");

            return new OfficerLoginResponse(
                    false,
                    "Face Verification Failed",
                    null,
                    null,
                    null,
                    null);
        }

        // Login Audit
        auditService.saveLog(
                existingOfficer.getOfficerId(),
                isLocalDevelopmentAccount ? "LOCAL DEV LOGIN" : "LOGIN",
                existingOfficer.getFullName() + " logged into the system.");

        return new OfficerLoginResponse(
                true,
                "Login Successful",
                existingOfficer.getOfficerId(),
                existingOfficer.getFullName(),
                existingOfficer.getRole(),
                authTokenService.issue(existingOfficer.getOfficerId(), existingOfficer.getRole()));
    }

    // ===========================
    // Update Officer
    // ===========================
    public Officer updateOfficer(String officerId, Officer updatedOfficer) {

        Optional<Officer> officer = officerRepository.findByOfficerId(officerId);

        if (officer.isPresent()) {

            Officer existing = officer.get();

            existing.setFullName(updatedOfficer.getFullName());
            if (updatedOfficer.getPassword() != null && !updatedOfficer.getPassword().isBlank()) {
                existing.setPassword(passwordEncoder.encode(updatedOfficer.getPassword()));
            }
            existing.setRole(updatedOfficer.getRole());
            existing.setActive(updatedOfficer.isActive());

            Officer updated = officerRepository.save(existing);

            auditService.saveLog(
                    existing.getOfficerId(),
                    "UPDATE OFFICER",
                    "Officer details updated.");

            return updated;
        }

        return null;
    }

    // ===========================
    // Activate / Deactivate Officer
    // ===========================
    public Officer changeStatus(String officerId, boolean active) {

        Optional<Officer> officer = officerRepository.findByOfficerId(officerId);

        if (officer.isPresent()) {

            Officer existing = officer.get();

            existing.setActive(active);

            Officer updated = officerRepository.save(existing);

            auditService.saveLog(
                    existing.getOfficerId(),
                    active ? "ACTIVATE OFFICER" : "DEACTIVATE OFFICER",
                    "Officer status changed.");

            return updated;
        }

        return null;
    }

    // ===========================
    // Officer Count
    // ===========================
    public long getOfficerCount() {
        return officerRepository.count();
    }

    private boolean passwordMatches(Officer officer, String submittedPassword) {
        if (submittedPassword == null || submittedPassword.isBlank()) {
            return false;
        }
        if (officer.getPassword().startsWith("$2")) {
            return passwordEncoder.matches(submittedPassword, officer.getPassword());
        }

        // Upgrade existing development data on the first successful login.
        if (officer.getPassword().equals(submittedPassword)) {
            officer.setPassword(passwordEncoder.encode(submittedPassword));
            officerRepository.save(officer);
            return true;
        }
        return false;
    }

}
