package com.klef.soa.exam.entity;


import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name="dmc")
public class DigitalMarketingCampaign {
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  @Id
   private Long id;
  @Column(length = 50,nullable=false)
  private String campaignName;
  @Column(length = 50,nullable=false)
  private String platform;
  @Column(nullable=false)
  private Double budget;
  @Column(nullable=false)
  private boolean active;
  public Long getId() {
	return id;
  }
  public void setId(Long id) {
	this.id = id;
  }
  public String getCampaignName() {
	return campaignName;
  }
  public void setCampaignName(String campaignName) {
	this.campaignName = campaignName;
  }
  public String getPlatform() {
	return platform;
  }
  public void setPlatform(String platform) {
	this.platform = platform;
  }
  public Double getBudget() {
	return budget;
  }
  public void setBudget(Double budget) {
	this.budget = budget;
  }
  public boolean isActive() {
	return active;
  }
  public void setActive(boolean active) {
	this.active = active;
  }
  @Override
  public String toString() {
	return "DigitalMarketingCampaign [id=" + id + ", campaignName=" + campaignName + ", platform=" + platform
			+ ", budget=" + budget + ", active=" + active + "]";
  }
  
}
