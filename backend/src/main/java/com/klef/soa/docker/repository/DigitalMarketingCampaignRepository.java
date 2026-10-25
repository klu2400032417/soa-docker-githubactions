package com.klef.soa.exam.repository;

import org.springframework.stereotype.Repository;

import com.klef.soa.exam.entity.DigitalMarketingCampaign;

import org.springframework.data.jpa.repository.JpaRepository;
@Repository
public interface DigitalMarketingCampaignRepository extends JpaRepository<DigitalMarketingCampaign, Long>{

}
