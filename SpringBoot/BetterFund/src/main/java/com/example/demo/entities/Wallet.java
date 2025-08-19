package com.example.demo.entities;

import java.time.LocalDate;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.*;

@Entity
public class Wallet {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer walletId;

    @ManyToOne
    @JoinColumn(name = "user_id")
    @JsonIgnore
    private User user;

    private Float amount;
    private Float curBalance;
    private LocalDate creationDate;

    @OneToOne(mappedBy = "wallet")
    @JsonBackReference
    private Campaign campaign;


	public Wallet() {
		super();
		// TODO Auto-generated constructor stub
	}

	public Integer getWalletId() {
		return walletId;
	}



	public void setWalletId(Integer walletId) {
		this.walletId = walletId;
	}



	public User getUser() {
		return user;
	}

	public void setUser(User user) {
		this.user = user;
	}

	public Float getAmount() {
		return amount;
	}

	public void setAmount(Float amount) {
		this.amount = amount;
	}

	public Float getCurBalance() {
		return curBalance;
	}

	public void setCurBalance(Float curBalance) {
		this.curBalance = curBalance;
	}

	public LocalDate getCreationDate() {
		return creationDate;
	}

	public void setCreationDate(LocalDate creationDate) {
		this.creationDate = creationDate;
	}

	public Campaign getCampaign() {
		return campaign;
	}

	public void setCampaign(Campaign campaign) {
		this.campaign = campaign;
	}

    
}
