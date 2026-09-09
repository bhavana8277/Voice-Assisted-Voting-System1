package com.voicevoting.backend.entity;

import jakarta.persistence.*;
import com.fasterxml.jackson.annotation.JsonIgnore;
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

    @JsonIgnore
    @Column(name = "candidate_id", nullable = false)
    private String ballotReference;

    @Column(nullable = false)
    private String pollingOfficerId;

    @JsonIgnore
    @Column(name = "encrypted_vote", nullable = false)
    private String receiptId;
}
