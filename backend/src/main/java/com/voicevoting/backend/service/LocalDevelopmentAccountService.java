package com.voicevoting.backend.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
public class LocalDevelopmentAccountService {
    @Value("${app.local-development-accounts.enabled:false}")
    private boolean enabled;

    @Value("${app.local-development-accounts.admin-id:}")
    private String adminId;

    @Value("${app.local-development-accounts.polling-officer-id:}")
    private String pollingOfficerId;

    @Value("${app.local-development-accounts.election-officer-id:}")
    private String electionOfficerId;

    public boolean skipsFaceAuthentication(String officerId) {
        return enabled && (officerId.equals(adminId)
                || officerId.equals(pollingOfficerId)
                || officerId.equals(electionOfficerId));
    }
}
