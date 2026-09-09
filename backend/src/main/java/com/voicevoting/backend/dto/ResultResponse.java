package com.voicevoting.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class ResultResponse {

    private String candidateId;
    private String candidateName;
    private String partyName;
    private long votes;
}