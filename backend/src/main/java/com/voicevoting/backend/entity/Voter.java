package com.voicevoting.backend.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "voters")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Voter {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String voterId;

    @Column(nullable = false)
    private String fullName;

    @Column(nullable = false)
    private int age;

    @Column(nullable = false)
    private String gender;

    @Column(nullable = false)
    private String address;

    @Column(nullable = false)
    private boolean active;

    @Column(nullable = false)
    private boolean hasVoted;

    @Column(nullable = false)
    private String preferredLanguage;
}