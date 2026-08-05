package com.voicevoting.backend.controller;

import com.voicevoting.backend.service.FaceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

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
    public ResponseEntity<String> registerFace(
            @RequestParam String officerId) {

        try {

            // Step 1: Capture Face Images
            faceService.captureFaces(officerId);

            // Step 2: Train the Model Automatically

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