package com.voicevoting.backend.security;

import com.voicevoting.backend.entity.Officer;
import com.voicevoting.backend.repository.OfficerRepository;
import com.voicevoting.backend.service.AuditService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.context.annotation.Profile;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
@Profile("local-dev")
@ConditionalOnProperty(name = "app.local-development-accounts.enabled", havingValue = "true")
public class LocalDevelopmentOfficerInitializer implements ApplicationRunner {
    private final OfficerRepository officerRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuditService auditService;

    @Value("${app.local-development-accounts.admin-id}")
    private String adminId;
    @Value("${app.local-development-accounts.admin-password}")
    private String adminPassword;
    @Value("${app.local-development-accounts.polling-officer-id}")
    private String pollingOfficerId;
    @Value("${app.local-development-accounts.polling-officer-password}")
    private String pollingOfficerPassword;
    @Value("${app.local-development-accounts.election-officer-id}")
    private String electionOfficerId;
    @Value("${app.local-development-accounts.election-officer-password}")
    private String electionOfficerPassword;

    public LocalDevelopmentOfficerInitializer(OfficerRepository officerRepository,
                                              PasswordEncoder passwordEncoder,
                                              AuditService auditService) {
        this.officerRepository = officerRepository;
        this.passwordEncoder = passwordEncoder;
        this.auditService = auditService;
    }

    @Override
    public void run(ApplicationArguments args) {
        createIfMissing(adminId, "Local Development Admin", adminPassword, "ADMIN");
        createIfMissing(pollingOfficerId, "Local Development Polling Officer", pollingOfficerPassword,
                "POLLING_OFFICER");
        createIfMissing(electionOfficerId, "Local Development Election Officer", electionOfficerPassword,
                "ELECTION_OFFICER");
    }

    private void createIfMissing(String officerId, String fullName, String password, String role) {
        if (officerRepository.findByOfficerId(officerId).isPresent()) {
            return;
        }
        Officer officer = new Officer();
        officer.setOfficerId(officerId);
        officer.setFullName(fullName);
        officer.setPassword(passwordEncoder.encode(password));
        officer.setRole(role);
        officer.setActive(true);
        officerRepository.save(officer);
        auditService.saveLog(officerId, "CREATE LOCAL DEV ACCOUNT", "Local development account initialized.");
    }
}
