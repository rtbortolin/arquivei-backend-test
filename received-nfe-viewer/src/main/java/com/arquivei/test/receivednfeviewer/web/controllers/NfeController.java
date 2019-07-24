package com.arquivei.test.receivednfeviewer.web.controllers;

import com.arquivei.test.receivednfeviewer.web.model.NfeData;
import com.arquivei.test.receivednfeviewer.web.model.rest.RestResponse;
import com.arquivei.test.receivednfeviewer.web.model.rest.Status;
import com.arquivei.test.receivednfeviewer.web.repositories.NfeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.net.URI;

@RestController
public class NfeController {

    @Autowired
    private NfeRepository nfeRepository;

    @GetMapping("/api/nfe/{accessKey}")
    public ResponseEntity<RestResponse> getNfe(@PathVariable String accessKey) {
        if (nfeRepository.existsById(accessKey)) {
            NfeData data = nfeRepository.getOne(accessKey);
            return ResponseEntity.ok(new RestResponse(getStatusFromHttpStatus(HttpStatus.OK), data));
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(new RestResponse(getStatusFromHttpStatus(HttpStatus.NOT_FOUND)));
        }
    }

    @PostMapping("/api/nfe")
    public ResponseEntity<Object> saveNfe(@RequestBody NfeData nfe) {
        if (StringUtils.isEmpty(nfe.getAccessKey())) {
            Status responseStatus = getStatusFromHttpStatus(HttpStatus.BAD_REQUEST);
            responseStatus.setMessage("Missing mandatory field 'accessKey'");
            return ResponseEntity.badRequest().body(new RestResponse(responseStatus));
        }
        if (StringUtils.isEmpty(nfe.getTotalValue())) {
            Status responseStatus = getStatusFromHttpStatus(HttpStatus.BAD_REQUEST);
            responseStatus.setMessage("Missing mandatory field 'totalValue'");
            return ResponseEntity.badRequest().body(new RestResponse(responseStatus));
        }

        NfeData savedNfe = nfeRepository.save(nfe);

        URI location = ServletUriComponentsBuilder.fromCurrentRequest().path("/{accessKey}")
                .buildAndExpand(savedNfe.getAccessKey()).toUri();

        return ResponseEntity.created(location).body(new RestResponse(getStatusFromHttpStatus(HttpStatus.CREATED)));
    }

    private Status getStatusFromHttpStatus(HttpStatus status) {
        Status responseStatus = new Status();
        responseStatus.setCode(status.value());
        responseStatus.setMessage(status.getReasonPhrase());
        return responseStatus;
    }
}
