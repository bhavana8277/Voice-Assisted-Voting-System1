package com.voicevoting.backend.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.security.access.prepost.PreAuthorize;

import java.io.*;
import java.io.FileOutputStream;

@RestController
@RequestMapping("/api/speech")
@CrossOrigin(origins = "http://localhost:5173")
public class SpeechController {

    private static final String PYTHON = "D:\\Voice-Assisted-Voting-System1\\.venv311\\Scripts\\python.exe";

    private static final String SCRIPT = "python\\speech_to_text.py";

    @PostMapping("/transcribe")
    @PreAuthorize("hasAnyRole('ADMIN', 'POLLING_OFFICER')")
    public ResponseEntity<String> transcribe(
            @RequestParam("audio") MultipartFile audio) {

        try {

            // Create temp folder
            File tempFolder = new File("temp");

            if (!tempFolder.exists()) {
                tempFolder.mkdirs();
            }

            // Save uploaded audio
            File audioFile = new File(tempFolder, "audio.webm");

            // Save manually
            try (FileOutputStream fos = new FileOutputStream(audioFile)) {
                fos.write(audio.getBytes());
            }

            // Execute Python
            ProcessBuilder pb = new ProcessBuilder(
                    PYTHON,
                    SCRIPT,
                    audioFile.getAbsolutePath());

            pb.redirectErrorStream(true);

            Process process = pb.start();

            BufferedReader reader = new BufferedReader(
                    new InputStreamReader(process.getInputStream()));

            StringBuilder result = new StringBuilder();

            String line;

            while ((line = reader.readLine()) != null) {

                result.append(line);

            }

            int exitCode = process.waitFor();

            if (exitCode != 0) {

                return ResponseEntity
                        .internalServerError()
                        .body("Python Error");

            }

            return ResponseEntity.ok(result.toString().trim());

        } catch (Exception e) {

            e.printStackTrace();

            return ResponseEntity
                    .internalServerError()
                    .body(e.getMessage());

        }

    }

}
