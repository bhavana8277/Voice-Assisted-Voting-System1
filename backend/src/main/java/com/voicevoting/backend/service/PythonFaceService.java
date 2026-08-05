package com.voicevoting.backend.service;

import org.springframework.stereotype.Service;

import java.io.BufferedReader;
import java.io.InputStreamReader;

@Service
public class PythonFaceService {

    public boolean verifyOfficer(String officerId) {

        try {

            ProcessBuilder pb = new ProcessBuilder(
                    "D:\\Voice-Assisted-Voting-System1\\.venv311\\Scripts\\python.exe",
                    "python\\recognize_face.py",
                    officerId);

            pb.directory(new java.io.File("D:\\Voice-Assisted-Voting-System1\\backend"));
            pb.redirectErrorStream(true);

            Process process = pb.start();

            BufferedReader reader = new BufferedReader(
                    new InputStreamReader(process.getInputStream()));

            String line;

            while ((line = reader.readLine()) != null) {

                System.out.println("PYTHON : " + line);

                if (line.contains("AUTH_SUCCESS")) {
                    return true;
                }

                if (line.contains("AUTH_FAILED")) {
                    return false;
                }
            }

            process.waitFor();

        } catch (Exception e) {
            e.printStackTrace();
        }

        return false;
    }
}