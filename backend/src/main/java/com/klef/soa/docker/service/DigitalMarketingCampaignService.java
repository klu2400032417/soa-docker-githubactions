package com.klef.soa.exam.service;

import java.util.List;
import java.util.Optional;

import com.klef.soa.exam.entity.DigitalMarketingCampaign;

public interface DigitalMarketingCampaignService {
	DigitalMarketingCampaign addCampaign(DigitalMarketingCampaign d);
	List<DigitalMarketingCampaign> displayAll();
	Optional<DigitalMarketingCampaign> getCampaignById(Long id);
	DigitalMarketingCampaign updateCampaign(Long id, DigitalMarketingCampaign d);
	String deleteById(Long id);
}
