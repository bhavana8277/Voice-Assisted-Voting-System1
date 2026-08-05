package com.voicevoting.backend.controller;

import com.voicevoting.backend.dto.ResultResponse;
import com.voicevoting.backend.service.ResultService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/results")
@CrossOrigin(origins = "*")
public class ResultController {

    @Autowired
    private ResultService resultService;

    @GetMapping
    public List<ResultResponse> getResults() {
        return resultService.getResults();
    }
}