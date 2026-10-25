package com.klef.soa.docker.service;

import java.util.List;
import java.util.Optional;

import com.klef.soa.docker.entity.DigitalMarketingCampaign;

public interface DigitalMarketingCampaignService {
	DigitalMarketingCampaign addCampaign(DigitalMarketingCampaign d);
	List<DigitalMarketingCampaign> displayAll();
	Optional<DigitalMarketingCampaign> getCampaignById(Long id);
	DigitalMarketingCampaign updateCampaign(Long id, DigitalMarketingCampaign d);
	String deleteById(Long id);
}
