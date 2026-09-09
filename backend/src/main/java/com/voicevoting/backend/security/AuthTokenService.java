package com.voicevoting.backend.security;

import org.springframework.stereotype.Service;

import java.security.SecureRandom;
import java.time.Instant;
import java.util.Base64;
import java.util.Map;
import java.util.Optional;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class AuthTokenService {
    private static final long TOKEN_LIFETIME_SECONDS = 8 * 60 * 60;
    private final SecureRandom secureRandom = new SecureRandom();
    private final Map<String, TokenSession> sessions = new ConcurrentHashMap<>();

    public String issue(String officerId, String role) {
        byte[] bytes = new byte[32];
        secureRandom.nextBytes(bytes);
        String token = Base64.getUrlEncoder().withoutPadding().encodeToString(bytes);
        sessions.put(token, new TokenSession(new AuthenticatedOfficer(officerId, role), Instant.now().plusSeconds(TOKEN_LIFETIME_SECONDS)));
        return token;
    }

    public Optional<AuthenticatedOfficer> resolve(String token) {
        TokenSession session = sessions.get(token);
        if (session == null) {
            return Optional.empty();
        }
        if (session.expiresAt().isBefore(Instant.now())) {
            sessions.remove(token);
            return Optional.empty();
        }
        return Optional.of(session.officer());
    }

    private record TokenSession(AuthenticatedOfficer officer, Instant expiresAt) {
    }
}
