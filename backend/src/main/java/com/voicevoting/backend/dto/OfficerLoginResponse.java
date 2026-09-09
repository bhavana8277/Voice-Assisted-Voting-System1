package com.voicevoting.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class OfficerLoginResponse {

    private boolean success;
    private String message;
    private String officerId;
    private String fullName;
    private String role;
    private String accessToken;

}
