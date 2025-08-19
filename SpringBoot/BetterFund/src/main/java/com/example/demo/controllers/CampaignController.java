package com.example.demo.controllers;

import com.example.demo.entities.*;

import com.example.demo.repositories.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import java.io.IOException;

import java.time.LocalDate;
import java.util.*;
import java.util.stream.Collectors;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api/campaign")
public class CampaignController {

    @Autowired
    private CampaignRepository campaignRepo;

    @Autowired
    private UserRepository userRepo;

    @Autowired
    private CategoryRepository categoryRepo;

    @Autowired
    private WalletRepository walletRepo;

    @Autowired
    private DocumentsRepository docRepo;

    @Autowired
    private RoleRepository roleRepo;
    
/////////////// GET ALL ACTIVE CAMPGINS ////////////////////////
    @GetMapping("/active")
    public List<Map<String, Object>> getAllActiveCampaigns() {
        List<Campaign> activeCampaigns = campaignRepo.findByStatus("active");

        LocalDate today = LocalDate.now();

        // Auto-complete campaigns
        for (Campaign c : activeCampaigns) {
            boolean expired = c.getEndDate().isBefore(today);
            boolean targetReached = c.getWallet().getAmount() >= c.getTargetAmt();

            if (expired || targetReached) {
                c.setStatus("completed");
                campaignRepo.save(c);
            }
        }
        

        // Return only still-active
        List<Campaign> filtered = campaignRepo.findByStatus("active");

        return filtered.stream().map(campaign -> {
            Map<String, Object> response = new HashMap<>();
            response.put("campaignId", campaign.getCampaignId());
            response.put("title", campaign.getTitle());
            response.put("description", campaign.getDescription());
            response.put("startDate", campaign.getStartDate());
            response.put("endDate", campaign.getEndDate());
            response.put("targetAmt", campaign.getTargetAmt());
            response.put("status", campaign.getStatus());

            Map<String, Object> userMap = new HashMap<>();
            userMap.put("username", campaign.getUser().getUsername());
            response.put("user", userMap);

            Map<String, Object> categoryMap = new HashMap<>();
            categoryMap.put("categoryId", campaign.getCategory().getCategoryId());
            categoryMap.put("cname", campaign.getCategory().getCname());
            response.put("category", categoryMap);

            Map<String, Object> walletMap = new HashMap<>();
            walletMap.put("amount", campaign.getWallet().getAmount());
            response.put("wallet", walletMap);

            return response;
        }).collect(Collectors.toList());
    }

/////////////////// END OF ACTIVE CAMPGINS //////////////////////

    
/////////////// GET  ACTIVE CAMPGINS BY ID////////////////////////    
    @GetMapping("/{id}")
    public ResponseEntity<Map<String, Object>> getCampaignById(@PathVariable Integer id) {
        Optional<Campaign> optionalCampaign = campaignRepo.findById(id);

        if (optionalCampaign.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Campaign campaign = optionalCampaign.get();
        Map<String, Object> response = new HashMap<>();

        response.put("campaignId", campaign.getCampaignId());
        response.put("title", campaign.getTitle());
        response.put("description", campaign.getDescription());

        response.put("startDate", campaign.getStartDate());
        response.put("endDate", campaign.getEndDate());
        response.put("targetAmt", campaign.getTargetAmt());
        response.put("status", campaign.getStatus());

        // Minimal User Info
        Map<String, Object> userMap = new HashMap<>();
        userMap.put("username", campaign.getUser().getUsername());
        response.put("user", userMap);

        // Minimal Category Info
        Map<String, Object> categoryMap = new HashMap<>();
        categoryMap.put("categoryId", campaign.getCategory().getCategoryId());
        categoryMap.put("cname", campaign.getCategory().getCname());
        response.put("category", categoryMap);

        // Wallet Info
        Map<String, Object> walletMap = new HashMap<>();
        walletMap.put("amount", campaign.getWallet().getAmount());
        response.put("wallet", walletMap);

        return ResponseEntity.ok(response);
    }
    
/////////////// END OF ACTIVE CAMPGINS BY ID////////////////////////  

    
/////////////// CREATE CAMPAIGN ////////////////////////  
    @PostMapping("/create")
    public ResponseEntity<?> createCampaign(
            @RequestParam Integer userId,
            @RequestParam String title,
            @RequestParam String description, // 👈 New Param
            @RequestParam Integer categoryId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate,
            @RequestParam Float targetAmt,
            @RequestParam MultipartFile documentFile
    ) throws IOException {

        User user = userRepo.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Role campaignCreatorRole = roleRepo.findById(2)
                .orElseThrow(() -> new RuntimeException("Campaign Creator role not found"));
        user.setRole(campaignCreatorRole);
        userRepo.save(user);

        Category category = categoryRepo.findById(categoryId)
                .orElseThrow(() -> new RuntimeException("Category not found"));

        // Save document
        Documents doc = new Documents();
        doc.setDocuments(documentFile.getBytes());
        doc.setFileName(documentFile.getOriginalFilename());
        doc.setContentType(documentFile.getContentType());
        docRepo.save(doc);

        // Create wallet
        Wallet wallet = new Wallet();
        wallet.setUser(user);
        wallet.setAmount(0f);
        wallet.setCurBalance(0f);
        wallet.setCreationDate(LocalDate.now());
        walletRepo.save(wallet);

        // Create campaign
        Campaign campaign = new Campaign();
        campaign.setUser(user);
        campaign.setTitle(title);
        campaign.setDescription(description); // 👈 Set description
        campaign.setCategory(category);
        campaign.setStartDate(startDate);
        campaign.setEndDate(endDate);
        campaign.setTargetAmt(targetAmt);
        campaign.setWallet(wallet);
        campaign.setDocument(doc);
        campaign.setStatus("pending");
        campaignRepo.save(campaign);

        return ResponseEntity.ok("Request for campaign creation successful!");
    }
  
    
/////////////// END OF CREATE CAMPAIGN //////////////////////// 

/////////////// GET DASHBORD STATS ///////////////////////////    
    @GetMapping("/admin/dashboard-stats")
    public Map<String, Object> getDashboardStats() {
        Map<String, Object> stats = new HashMap<>();

        long totalCampaigns = campaignRepo.count();
        long activeCampaigns = campaignRepo.countByStatus("active");

        List<Campaign> allCampaigns = campaignRepo.findAll();
        float totalRaised = 0f;
        for (Campaign c : allCampaigns) {
            if (c.getWallet() != null && c.getWallet().getAmount() != null) {
                totalRaised += c.getWallet().getAmount();
            }
        }

        stats.put("totalCampaigns", totalCampaigns);
        stats.put("activeCampaigns", activeCampaigns);
        stats.put("totalRaised", totalRaised);

        return stats;
    }
/////////////// END OF GET DASHBORD STATS ///////////////////////////  
  

////////////// FETCH PENDING CAMPAIGNS FOR ADMIN ////////////////////
    @GetMapping("/admin/pending-campaigns")
    public ResponseEntity<?> getPendingCampaigns() {
        List<Map<String, Object>> list = campaignRepo.findByStatus("pending")
                .stream()
                .map(c -> {
                    Map<String, Object> m = mapToDto(c);
                    if (c.getDocument() != null) {
                        String fileName = "document_" + c.getCampaignId() + ".pdf";
                        String base64 = Base64.getEncoder()
                                .encodeToString(c.getDocument().getDocuments());
                        m.put("documents",
                                List.of(Map.of("name", fileName, "content", base64)));
                    }
                    return m;
                })
                .collect(Collectors.toList());
        return ResponseEntity.ok(list);
    }

    
    //////////////END OF  PENDING CAMPAIGNS FOR ADMIN ////////////////////

    private Map<String, Object> mapToDto(Campaign c) {
        Map<String, Object> dto = new LinkedHashMap<>();
        dto.put("campaignId", c.getCampaignId());
        dto.put("title", c.getTitle());
        dto.put("startDate", c.getStartDate());
        dto.put("endDate", c.getEndDate());
        dto.put("targetAmt", c.getTargetAmt());
        dto.put("status", c.getStatus());

        Map<String, Object> user = new HashMap<>();
        user.put("username", c.getUser().getUsername());
        user.put("email", c.getUser().getEmail());
        dto.put("user", user);

        Map<String, Object> cat = new HashMap<>();
        cat.put("categoryId", c.getCategory().getCategoryId());
        cat.put("cname", c.getCategory().getCname());
        dto.put("category", cat);

        Map<String, Object> wallet = new HashMap<>();
        wallet.put("amount", c.getWallet().getAmount());
        dto.put("wallet", wallet);

        return dto;
    }
}




