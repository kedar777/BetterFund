package com.example.demo.repositories;

import com.example.demo.entities.Campaign;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CampaignRepository extends JpaRepository<Campaign, Integer> {
	List<Campaign> findByStatus(String status);

	long countByStatus(String string);
}
