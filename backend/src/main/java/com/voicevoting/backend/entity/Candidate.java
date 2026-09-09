package com.voicevoting.backend.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "candidates")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Candidate {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "candidate_id", nullable = false, unique = true)
    private String candidateId;

    @Column(name = "candidate_name", nullable = false)
    private String candidateName;

    @Column(name = "party_name", nullable = false)
    private String partyName;

    @Column(nullable = false)
    private String symbol;

    @Column(nullable = false)
    private boolean active;
}