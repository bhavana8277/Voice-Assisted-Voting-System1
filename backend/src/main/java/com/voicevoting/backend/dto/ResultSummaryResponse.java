package com.voicevoting.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
public class ResultSummaryResponse {
    private long registeredVoters;
    private long ballotsCast;
    private long votersMarkedVoted;
    private long candidateCount;
    private double turnoutPercentage;
    private boolean tallyConsistent;
    private LocalDateTime generatedAt;
}
