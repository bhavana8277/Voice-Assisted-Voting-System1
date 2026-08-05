package com.voicevoting.backend.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "votes")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Vote {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(nullable = false, unique = true)
    private String voterId;

    @Column(nullable = false)
    private String candidateId;

    @Column(nullable = false)
    private String pollingOfficerId;

    @Column(nullable = false)
    private String encryptedVote;
}