package com.arquivei.test.receivednfeviewer.web.controllers;

import com.arquivei.test.receivednfeviewer.web.model.NfeData;
import com.arquivei.test.receivednfeviewer.web.repositories.NfeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.net.URI;

@RestController
public class NfeController {

    @Autowired
    private NfeRepository nfeRepository;

    @GetMapping("/api/nfe/{accessKey}")
    public NfeData getNfe(@PathVariable String accessKey) {
        return nfeRepository.getOne(accessKey);
    }

    @PostMapping("/api/nfe")
    public ResponseEntity<Object> saveNfe(@RequestBody NfeData nfe) {
        NfeData savedNfe = nfeRepository.save(nfe);

        URI location = ServletUriComponentsBuilder.fromCurrentRequest().path("/{accessKey}")
                .buildAndExpand(savedNfe.getAccessKey()).toUri();

        return ResponseEntity.created(location).build();
    }
}
