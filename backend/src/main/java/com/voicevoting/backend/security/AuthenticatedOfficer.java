package com.voicevoting.backend.security;

public record AuthenticatedOfficer(String officerId, String role) {
}
