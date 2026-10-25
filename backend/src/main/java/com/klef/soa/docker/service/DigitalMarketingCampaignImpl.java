package com.klef.soa.exam.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.klef.soa.exam.entity.DigitalMarketingCampaign;
import com.klef.soa.exam.repository.DigitalMarketingCampaignRepository;

@Service
public class DigitalMarketingCampaignImpl implements DigitalMarketingCampaignService{
    @Autowired
    private DigitalMarketingCampaignRepository repo;
	@Override
	public DigitalMarketingCampaign addCampaign(DigitalMarketingCampaign d) {
		
		return repo.save(d);
	}

	@Override
	public List<DigitalMarketingCampaign> displayAll() {
		return repo.findAll();
	}

	@Override
	public String deleteById(Long id) {
		Optional<DigitalMarketingCampaign> optional=repo.findById(id);
		if(optional.isPresent()) {
			DigitalMarketingCampaign dmc=optional.get();
			repo.delete(dmc);
			return "deleted successfully";
		}
		else
		return "Id not found";
	}

	@Override
	public Optional<DigitalMarketingCampaign> getCampaignById(Long id) {
	    return repo.findById(id);
	}

	@Override
	public DigitalMarketingCampaign updateCampaign(Long id, DigitalMarketingCampaign d) {
	    Optional<DigitalMarketingCampaign> optional = repo.findById(id);

	    if (optional.isPresent()) {
	        DigitalMarketingCampaign existing = optional.get();

	        existing.setCampaignName(d.getCampaignName());
	        existing.setPlatform(d.getPlatform());
	        existing.setBudget(d.getBudget());
	        existing.setActive(d.isActive());

	        return repo.save(existing);
	    }

	    return null;
	}

}
