import { Request, Response } from 'express';
import { storage } from './storage';
import { adTrackerHits } from '@shared/schema';

/**
 * Record a hit (visit) to an ad tracker
 * 
 * This function handles recording page visits from marketing campaigns.
 * It captures UTM parameters, device info, and other tracking data.
 */
export async function recordTrackerHit(req: Request, res: Response) {
  try {
    const trackerId = parseInt(req.params.trackerId);
    
    if (isNaN(trackerId)) {
      return res.status(400).json({ error: "Invalid tracker ID format" });
    }
    
    // Get the tracker to make sure it exists
    const tracker = await storage.getAdTrackerById(trackerId);
    if (!tracker) {
      return res.status(404).json({ error: "Tracker not found" });
    }
    
    // Extract data from request body
    const {
      sessionId,
      pageUrl,
      sourcePlatform,
      sourceUrl,
      utmSource,
      utmMedium, 
      utmCampaign,
      utmTerm,
      utmContent,
      deviceType,
    } = req.body;
    
    // Validate required fields
    if (!sessionId || !pageUrl || !sourcePlatform) {
      return res.status(400).json({ 
        error: "Missing required fields", 
        required: ["sessionId", "pageUrl", "sourcePlatform"] 
      });
    }
    
    // Get the client IP address
    const ipAddress = req.headers['x-forwarded-for'] || 
                      req.socket.remoteAddress || 
                      null;
    
    // Create the hit record
    const hit = await storage.createAdTrackerHit({
      trackerId,
      sessionId,
      pageUrl,
      sourcePlatform,
      sourceUrl,
      utmSource,
      utmMedium,
      utmCampaign,
      utmTerm,
      utmContent,
      deviceType,
      ipAddress: ipAddress as string | null,
      converted: false,
      timestamp: new Date(),
    });
    
    res.status(200).json(hit);
  } catch (error) {
    console.error("Error recording tracker hit:", error);
    res.status(500).json({ error: "Failed to record hit" });
  }
}

/**
 * Record a conversion for an ad tracker
 * 
 * This function handles recording conversions from marketing campaigns.
 * It updates the 'converted' status of a previous hit based on session ID.
 */
export async function recordConversion(req: Request, res: Response) {
  try {
    const trackerId = parseInt(req.params.trackerId);
    
    if (isNaN(trackerId)) {
      return res.status(400).json({ error: "Invalid tracker ID format" });
    }
    
    // Get the tracker to make sure it exists
    const tracker = await storage.getAdTrackerById(trackerId);
    if (!tracker) {
      return res.status(404).json({ error: "Tracker not found" });
    }
    
    // Extract data from request body
    const {
      sessionId,
      conversionType = 'default',
      pageUrl,
    } = req.body;
    
    // Validate required fields
    if (!sessionId) {
      return res.status(400).json({ 
        error: "Missing required fields", 
        required: ["sessionId"] 
      });
    }
    
    // Find existing hits for this session
    const hits = await storage.getAdTrackerHitsBySessionId(sessionId, trackerId);
    
    if (hits.length === 0) {
      // If no previous hit found, create a new hit with conversion
      const ipAddress = req.headers['x-forwarded-for'] || 
                        req.socket.remoteAddress || 
                        null;
      
      const hit = await storage.createAdTrackerHit({
        trackerId,
        sessionId,
        pageUrl: pageUrl || req.headers.referer || '',
        sourcePlatform: 'direct',
        utmSource: req.body.utmSource || null,
        utmMedium: req.body.utmMedium || null,
        utmCampaign: req.body.utmCampaign || null,
        converted: true,
        conversionType,
        timestamp: new Date(),
        ipAddress: ipAddress as string | null,
      });
      
      return res.status(200).json(hit);
    }
    
    // Update the most recent hit to mark it as converted
    const mostRecentHit = hits.reduce((latest, current) => {
      return new Date(latest.timestamp) > new Date(current.timestamp) ? latest : current;
    });
    
    const updatedHit = await storage.updateAdTrackerHitConversion(
      mostRecentHit.id,
      true,
      conversionType
    );
    
    res.status(200).json(updatedHit);
  } catch (error) {
    console.error("Error recording conversion:", error);
    res.status(500).json({ error: "Failed to record conversion" });
  }
}

/**
 * Generate a tracking URL for marketing campaigns
 * 
 * This function creates and stores tracking URLs with UTM parameters.
 */
export async function generateTrackingUrl(req: Request, res: Response) {
  try {
    const {
      baseUrl,
      platform,
      utmSource,
      utmMedium,
      utmCampaign,
      utmTerm,
      utmContent,
      notes,
    } = req.body;
    
    // Validate required fields
    if (!baseUrl || !platform || !utmSource || !utmMedium || !utmCampaign) {
      return res.status(400).json({ 
        error: "Missing required fields", 
        required: ["baseUrl", "platform", "utmSource", "utmMedium", "utmCampaign"] 
      });
    }
    
    // Create URL with UTM parameters
    const url = new URL(baseUrl);
    url.searchParams.append('utm_source', utmSource);
    url.searchParams.append('utm_medium', utmMedium);
    url.searchParams.append('utm_campaign', utmCampaign);
    
    if (utmTerm) url.searchParams.append('utm_term', utmTerm);
    if (utmContent) url.searchParams.append('utm_content', utmContent);
    
    const trackingUrl = url.toString();
    
    // Look for existing tracker for this campaign
    let tracker = await storage.getAdTrackerByCampaignId(utmCampaign);
    
    // Create new tracker if none exists
    if (!tracker) {
      tracker = await storage.createAdTracker({
        name: `${platform} - ${utmCampaign}`,
        platform,
        campaignId: utmCampaign,
        conversionGoal: 'any',
        active: true,
        parameters: {
          utmSource,
          utmMedium,
          utmCampaign,
          utmTerm,
          utmContent,
          baseUrl,
          notes,
          trackingUrl
        },
        createdAt: new Date(),
        updatedAt: new Date()
      });
    }
    
    res.status(200).json({
      trackingUrl,
      trackerId: tracker.id,
      campaign: utmCampaign,
    });
  } catch (error) {
    console.error("Error generating tracking URL:", error);
    res.status(500).json({ error: "Failed to generate tracking URL" });
  }
}

/**
 * Get analytics data for a specific tracker
 * 
 * This function retrieves analytics data for a specific tracker,
 * including hits, conversions, and conversion rates.
 */
export async function getTrackerAnalytics(req: Request, res: Response) {
  try {
    const trackerId = parseInt(req.params.trackerId);
    
    if (isNaN(trackerId)) {
      return res.status(400).json({ error: "Invalid tracker ID format" });
    }
    
    // Get the tracker to make sure it exists
    const tracker = await storage.getAdTrackerById(trackerId);
    if (!tracker) {
      return res.status(404).json({ error: "Tracker not found" });
    }
    
    // Get date range from query parameters
    const { startDate, endDate, groupBy = 'day' } = req.query;
    
    // Get hits for this tracker
    const hits = await storage.getAdTrackerHitsByTrackerId(trackerId, {
      startDate: startDate ? new Date(startDate as string) : undefined,
      endDate: endDate ? new Date(endDate as string) : undefined,
    });
    
    // Count total hits and conversions
    const totalHits = hits.length;
    const conversions = hits.filter(hit => hit.converted).length;
    const conversionRate = totalHits > 0 ? (conversions / totalHits) * 100 : 0;
    
    // Group data by date if requested
    let groupedData = [];
    if (groupBy === 'day' || groupBy === 'week' || groupBy === 'month') {
      const grouped = new Map();
      
      hits.forEach(hit => {
        const date = new Date(hit.timestamp);
        let groupKey;
        
        if (groupBy === 'day') {
          groupKey = date.toISOString().split('T')[0]; // YYYY-MM-DD
        } else if (groupBy === 'week') {
          // Get the Monday of the week
          const day = date.getDay();
          const diff = date.getDate() - day + (day === 0 ? -6 : 1);
          const monday = new Date(date);
          monday.setDate(diff);
          groupKey = monday.toISOString().split('T')[0];
        } else if (groupBy === 'month') {
          groupKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
        }
        
        if (!grouped.has(groupKey)) {
          grouped.set(groupKey, { date: groupKey, hits: 0, conversions: 0 });
        }
        
        const group = grouped.get(groupKey);
        group.hits++;
        if (hit.converted) {
          group.conversions++;
        }
      });
      
      // Sort by date and add conversion rate
      groupedData = Array.from(grouped.values())
        .map(group => ({
          ...group,
          conversionRate: group.hits > 0 ? (group.conversions / group.hits) * 100 : 0
        }))
        .sort((a, b) => a.date.localeCompare(b.date));
    }
    
    // Get source platform analytics
    const sourcePlatforms = hits.reduce((acc, hit) => {
      const platform = hit.sourcePlatform || 'unknown';
      if (!acc[platform]) {
        acc[platform] = { hits: 0, conversions: 0 };
      }
      acc[platform].hits++;
      if (hit.converted) {
        acc[platform].conversions++;
      }
      return acc;
    }, {} as Record<string, { hits: number; conversions: number }>);
    
    // Calculate conversion rates for each platform
    Object.keys(sourcePlatforms).forEach(platform => {
      const data = sourcePlatforms[platform];
      data.conversionRate = data.hits > 0 ? (data.conversions / data.hits) * 100 : 0;
    });
    
    // Get UTM parameter analytics
    const utmAnalytics = hits.reduce((acc, hit) => {
      // Add UTM source data
      if (hit.utmSource) {
        if (!acc.sources[hit.utmSource]) {
          acc.sources[hit.utmSource] = { hits: 0, conversions: 0 };
        }
        acc.sources[hit.utmSource].hits++;
        if (hit.converted) {
          acc.sources[hit.utmSource].conversions++;
        }
      }
      
      // Add UTM medium data
      if (hit.utmMedium) {
        if (!acc.mediums[hit.utmMedium]) {
          acc.mediums[hit.utmMedium] = { hits: 0, conversions: 0 };
        }
        acc.mediums[hit.utmMedium].hits++;
        if (hit.converted) {
          acc.mediums[hit.utmMedium].conversions++;
        }
      }
      
      // Add UTM campaign data
      if (hit.utmCampaign) {
        if (!acc.campaigns[hit.utmCampaign]) {
          acc.campaigns[hit.utmCampaign] = { hits: 0, conversions: 0 };
        }
        acc.campaigns[hit.utmCampaign].hits++;
        if (hit.converted) {
          acc.campaigns[hit.utmCampaign].conversions++;
        }
      }
      
      return acc;
    }, { 
      sources: {} as Record<string, { hits: number; conversions: number }>,
      mediums: {} as Record<string, { hits: number; conversions: number }>,
      campaigns: {} as Record<string, { hits: number; conversions: number }>
    });
    
    // Calculate conversion rates for UTM parameters
    Object.keys(utmAnalytics.sources).forEach(source => {
      const data = utmAnalytics.sources[source];
      data.conversionRate = data.hits > 0 ? (data.conversions / data.hits) * 100 : 0;
    });
    
    Object.keys(utmAnalytics.mediums).forEach(medium => {
      const data = utmAnalytics.mediums[medium];
      data.conversionRate = data.hits > 0 ? (data.conversions / data.hits) * 100 : 0;
    });
    
    Object.keys(utmAnalytics.campaigns).forEach(campaign => {
      const data = utmAnalytics.campaigns[campaign];
      data.conversionRate = data.hits > 0 ? (data.conversions / data.hits) * 100 : 0;
    });
    
    // Return analytics data
    res.status(200).json({
      tracker: {
        id: tracker.id,
        name: tracker.name,
        platform: tracker.platform,
        campaignId: tracker.campaignId,
        conversionGoal: tracker.conversionGoal,
        active: tracker.active,
        createdAt: tracker.createdAt,
      },
      analytics: {
        totalHits,
        conversions,
        conversionRate,
        timeSeries: groupedData,
        sourcePlatforms,
        utmAnalytics,
      }
    });
  } catch (error) {
    console.error("Error retrieving tracker analytics:", error);
    res.status(500).json({ error: "Failed to retrieve analytics data" });
  }
}