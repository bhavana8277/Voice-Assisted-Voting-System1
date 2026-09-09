package com.voicevoting.backend.controller;

import com.voicevoting.backend.service.FaceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.access.prepost.PreAuthorize;

@RestController
@RequestMapping("/api/face")
@CrossOrigin(origins = "*")
public class FaceController {

    @Autowired
    private FaceService faceService;

    // ----------------------------------------
    // Register Face (Capture + Train)
    // ----------------------------------------
    @PostMapping("/register")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<String> registerFace(
            @RequestParam String officerId) {

        try {

            // Step 1: Capture Face Images
            faceService.registerFace(officerId);

            return ResponseEntity.ok(
                    "Face registered and model trained successfully.");

        } catch (Exception e) {

            e.printStackTrace();

            return ResponseEntity.badRequest().body(
                    "Registration Failed: " + e.getMessage());
        }
    }

    // ----------------------------------------
    // Train Face Model Manually (Optional)
    // ----------------------------------------
    @PostMapping("/train")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<String> trainFaces() {

        try {

            faceService.trainFaces();

            return ResponseEntity.ok(
                    "Face model trained successfully.");

        } catch (Exception e) {

            e.printStackTrace();

            return ResponseEntity.badRequest().body(
                    "Training Failed: " + e.getMessage());
        }
    }
}
