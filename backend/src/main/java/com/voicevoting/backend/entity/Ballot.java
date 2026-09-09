package com.voicevoting.backend.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Lob;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "ballots")
@Getter
@NoArgsConstructor
public class Ballot {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String electionId;

    @Lob
    @Column(nullable = false)
    private String ciphertext;

    @Column(nullable = false, length = 24)
    private String nonce;

    @Column(nullable = false)
    private LocalDateTime castAt;

    public Ballot(String electionId, String ciphertext, String nonce) {
        this.electionId = electionId;
        this.ciphertext = ciphertext;
        this.nonce = nonce;
        this.castAt = LocalDateTime.now();
    }
}
