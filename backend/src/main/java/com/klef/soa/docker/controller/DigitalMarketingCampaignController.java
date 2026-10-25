
package com.klef.soa.docker.controller;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.klef.soa.docker.entity.DigitalMarketingCampaign;
import com.klef.soa.docker.service.DigitalMarketingCampaignService;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/DigitalMarketingCampaign")
public class DigitalMarketingCampaignController {

    @Autowired
    private DigitalMarketingCampaignService service;

    @GetMapping("/")
    public String home() {
        return "CRUD Service is running";
    }

    // READ ALL
    @GetMapping("/displayall")
    public List<DigitalMarketingCampaign> displayall() {
        return service.displayAll();
    }

    // CREATE
    @PostMapping("/add")
    public ResponseEntity<DigitalMarketingCampaign> addmember(
            @RequestBody DigitalMarketingCampaign d) {
        DigitalMarketingCampaign dmc = service.addCampaign(d);
        return ResponseEntity.ok(dmc);
    }

    // READ BY ID
    @GetMapping("/get/{id}")
    public ResponseEntity<DigitalMarketingCampaign> getById(
            @PathVariable Long id) {
        Optional<DigitalMarketingCampaign> optional =
                service.getCampaignById(id);

        if (optional.isPresent()) {
            return ResponseEntity.ok(optional.get());
        }

        return ResponseEntity.notFound().build();
    }

    // UPDATE
    @PutMapping("/update/{id}")
    public ResponseEntity<DigitalMarketingCampaign> update(
            @PathVariable Long id,
            @RequestBody DigitalMarketingCampaign d) {

        DigitalMarketingCampaign updated =
                service.updateCampaign(id, d);

        if (updated != null) {
            return ResponseEntity.ok(updated);
        }

        return ResponseEntity.notFound().build();
    }

    // DELETE
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<String> deletebyid(
            @PathVariable Long id) {
        String msg = service.deleteById(id);

        if ("deleted successfully".equals(msg)) {
            return ResponseEntity.ok(msg);
        }

        return ResponseEntity.status(404).body(msg);
    }
}
