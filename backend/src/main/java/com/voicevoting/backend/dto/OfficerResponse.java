package com.voicevoting.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class OfficerResponse {
    private String officerId;
    private String fullName;
    private String role;
    private boolean active;
}
