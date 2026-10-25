package com.klef.soa.docker.repository;

import org.springframework.stereotype.Repository;

import com.klef.soa.docker.entity.DigitalMarketingCampaign;

import org.springframework.data.jpa.repository.JpaRepository;
@Repository
public interface DigitalMarketingCampaignRepository extends JpaRepository<DigitalMarketingCampaign, Long>{

}
