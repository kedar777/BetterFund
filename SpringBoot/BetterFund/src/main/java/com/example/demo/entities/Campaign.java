package com.example.demo.entities;

import jakarta.persistence.*;

import java.time.LocalDate;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonManagedReference;

@Entity
public class Campaign {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer campaignId;

    @ManyToOne
    @JoinColumn(name = "user_id")
    @JsonIgnore
    private User user;

    private String title;
    private String description;




    @ManyToOne
    @JoinColumn(name = "category_id")
    private Category category;

    private LocalDate startDate;
    private LocalDate endDate;
    private Float targetAmt;
    private String status = "pending";

    @OneToOne
    @JoinColumn(name = "wallet_id")
    @JsonManagedReference
    private Wallet wallet;


    @OneToOne
    @JoinColumn(name = "document_id")
    private Documents document;
    
    

	public Campaign() {
		super();
	}

	public Integer getCampaignId() {
		return campaignId;
	}



	public void setCampaignId(Integer campaignId) {
		this.campaignId = campaignId;
	}



	public User getUser() {
		return user;
	}

	public void setUser(User user) {
		this.user = user;
	}

	public String getTitle() {
		return title;
	}

	public void setTitle(String title) {
		this.title = title;
	}
	
    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

	public Category getCategory() {
		return category;
	}

	public void setCategory(Category category) {
		this.category = category;
	}

	public LocalDate getStartDate() {
		return startDate;
	}

	public void setStartDate(LocalDate startDate) {
		this.startDate = startDate;
	}

	public LocalDate getEndDate() {
		return endDate;
	}

	public void setEndDate(LocalDate endDate) {
		this.endDate = endDate;
	}

	public Float getTargetAmt() {
		return targetAmt;
	}

	public void setTargetAmt(Float targetAmt) {
		this.targetAmt = targetAmt;
	}

	public String getStatus() {
		return status;
	}

	public void setStatus(String status) {
		this.status = status;
	}

	public Wallet getWallet() {
		return wallet;
	}

	public void setWallet(Wallet wallet) {
		this.wallet = wallet;
	}

	public Documents getDocument() {
		return document;
	}

	public void setDocument(Documents document) {
		this.document = document;
	}

    
}
