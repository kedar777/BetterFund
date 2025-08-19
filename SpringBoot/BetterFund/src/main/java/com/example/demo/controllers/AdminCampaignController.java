package com.example.demo.controllers;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;

import com.example.demo.entities.Campaign;
import com.example.demo.repositories.CampaignRepository;

import java.util.Map;

@RestController
@RequestMapping("/api/admin")
public class AdminCampaignController {

    @Autowired
    private CampaignRepository campaignRepository;

///////////////////// APROVE CAMPAGIN //////////////////////////
    @PutMapping("/campaigns/{id}/approve")
    public ResponseEntity<?> approveCampaign(@PathVariable Long id, @RequestBody Map<String, String> body) {
        Campaign campaign = campaignRepository.findById(id.intValue()).orElse(null);
        if (campaign == null) return ResponseEntity.notFound().build();

        campaign.setStatus("active");
        // Optional: store notes if you have a field
        campaignRepository.save(campaign);
        return ResponseEntity.ok("Campaign approved.");
    }
////////////// END OF APPROVE CAMPAGIN  ////////////////////

////////////// REJECT OF CAMPAGIN  ////////////////////
    @PutMapping("/campaigns/{id}/reject")
    public ResponseEntity<?> rejectCampaign(@PathVariable Long id, @RequestBody Map<String, String> body) {
        Campaign campaign = campaignRepository.findById(id.intValue()).orElse(null);
        if (campaign == null) return ResponseEntity.notFound().build();

        campaign.setStatus("rejected");
        // Optional: store notes if you have a field
        campaignRepository.save(campaign);
        return ResponseEntity.ok("Campaign rejected.");
    }
////////////// END OF REJECT OF CAMPAGIN  ////////////////////

}
