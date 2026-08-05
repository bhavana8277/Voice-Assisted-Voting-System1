package com.voicevoting.backend.controller;

import com.voicevoting.backend.dto.OfficerLoginRequest;
import com.voicevoting.backend.dto.OfficerLoginResponse;
import com.voicevoting.backend.entity.Officer;
import com.voicevoting.backend.service.OfficerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/officers")
@CrossOrigin(origins = "*")
public class OfficerController {

    @Autowired
    private OfficerService officerService;

    // Register Officer
    @PostMapping
    public Officer addOfficer(@RequestBody Officer officer) {

        System.out.println("========== ADD OFFICER ==========");
        System.out.println(officer.getOfficerId());
        System.out.println(officer.getFullName());
        System.out.println(officer.getPassword());
        System.out.println(officer.getRole());
        System.out.println(officer.isActive());

        Officer saved = officerService.addOfficer(officer);

        System.out.println("Saved Successfully");

        return saved;
    }

    @PutMapping("/{officerId}")
    public Officer updateOfficer(
            @PathVariable String officerId,
            @RequestBody Officer officer) {

        return officerService.updateOfficer(officerId, officer);
    }

    @PutMapping("/{officerId}/status")
    public Officer changeStatus(
            @PathVariable String officerId,
            @RequestParam boolean active) {

        return officerService.changeStatus(officerId, active);
    }

    // Get All Officers
    @GetMapping
    public List<Officer> getAllOfficers() {
        return officerService.getAllOfficers();
    }

    // Get Officer Count
    @GetMapping("/count")
    public long getOfficerCount() {
        return officerService.getOfficerCount();
    }

    // Get Officer by Officer ID
    @GetMapping("/{officerId}")
    public Optional<Officer> getOfficerByOfficerId(@PathVariable String officerId) {
        return officerService.getOfficerByOfficerId(officerId);
    }

    // Officer Login
    @PostMapping("/login")
    public OfficerLoginResponse login(@RequestBody OfficerLoginRequest request) {
        return officerService.login(request);
    }
}