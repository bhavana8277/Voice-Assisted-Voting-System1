package com.voicevoting.backend.service;

import org.springframework.stereotype.Service;

import java.io.BufferedReader;
import java.io.File;
import java.io.InputStreamReader;

@Service
public class FaceService {

    private static final String PYTHON_EXE = "D:\\Voice-Assisted-Voting-System1\\.venv311\\Scripts\\python.exe";

    private static final File PROJECT_DIR = new File("D:\\Voice-Assisted-Voting-System1\\backend");

    // =====================================
    // Capture Face Images
    // =====================================
    public void captureFaces(String officerId) throws Exception {

        ProcessBuilder processBuilder = new ProcessBuilder(
                PYTHON_EXE,
                "python\\capture_faces.py",
                officerId);

        processBuilder.directory(PROJECT_DIR);
        processBuilder.redirectErrorStream(true);

        Process process = processBuilder.start();

        BufferedReader reader = new BufferedReader(
                new InputStreamReader(process.getInputStream()));

        String line;

        while ((line = reader.readLine()) != null) {
            System.out.println(line);
        }

        int exitCode = process.waitFor();

        if (exitCode != 0) {
            throw new RuntimeException(
                    "Face capture failed with Exit Code : " + exitCode);
        }
    }

    // =====================================
    // Train Face Model
    // =====================================
    public void trainFaces() throws Exception {

        ProcessBuilder processBuilder = new ProcessBuilder(
                PYTHON_EXE,
                "python\\train_faces.py");

        processBuilder.directory(PROJECT_DIR);
        processBuilder.redirectErrorStream(true);

        Process process = processBuilder.start();

        BufferedReader reader = new BufferedReader(
                new InputStreamReader(process.getInputStream()));

        String line;

        while ((line = reader.readLine()) != null) {
            System.out.println(line);
        }

        int exitCode = process.waitFor();

        if (exitCode != 0) {
            throw new RuntimeException(
                    "Face training failed with Exit Code : " + exitCode);
        }
    }

    // =====================================
    // Capture + Train (Recommended)
    // =====================================
    public void registerFace(String officerId) throws Exception {

        System.out.println("======================================");
        System.out.println("Starting Face Registration...");
        System.out.println("Officer ID : " + officerId);
        System.out.println("======================================");

        // Step 1
        captureFaces(officerId);

        // Step 2
        trainFaces();

        System.out.println("======================================");
        System.out.println("Registration Completed Successfully!");
        System.out.println("======================================");
    }
}