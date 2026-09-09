package com.voicevoting.backend.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class VoteRequest {
    @NotBlank
    private String voterId;

    @NotBlank
    private String candidateId;
}
