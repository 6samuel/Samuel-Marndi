import { Request, Response } from 'express';
import { storage } from './storage';
import { z } from 'zod';
import { fromZodError } from 'zod-validation-error';

/**
 * Schema for validating ad tracker hit data
 */
const adTrackerHitSchema = z.object({
  sessionId: z.string(),
  source: z.string().optional(),
  campaign: z.string().optional(),
  medium: z.string().optional(),
  content: z.string().optional(),
  term: z.string().optional(),
  referrer: z.string().optional(),
  device: z.string().optional(),
});

/**
 * Schema for validating conversion data
 */
const conversionSchema = z.object({
  sessionId: z.string(),
  conversionType: z.string().optional(),
});

/**
 * Record a hit for a specific ad tracker
 */
export const recordTrackerHit = async (req: Request, res: Response) => {
  try {
    const trackerId = parseInt(req.params.trackerId);
    if (isNaN(trackerId)) {
      return res.status(400).json({ error: 'Invalid tracker ID' });
    }

    // Validate request body
    const validationResult = adTrackerHitSchema.safeParse(req.body);
    if (!validationResult.success) {
      const errorMessage = fromZodError(validationResult.error).message;
      return res.status(400).json({ error: errorMessage });
    }

    const hitData = validationResult.data;

    // Record the hit
    const hit = await storage.createAdTrackerHit({
      trackerId,
      sessionId: hitData.sessionId,
      source: hitData.source || 'direct',
      campaign: hitData.campaign || 'none',
      medium: hitData.medium || 'website',
      content: hitData.content || '',
      term: hitData.term || '',
      referrer: hitData.referrer || '',
      device: hitData.device || '',
      ip: req.ip || '',
      timestamp: new Date(),
      converted: false
    });

    res.status(200).json(hit);
  } catch (error) {
    console.error('Error recording hit:', error);
    res.status(500).json({ error: 'Failed to record hit' });
  }
};

/**
 * Record a conversion for a specific ad tracker
 */
export const recordConversion = async (req: Request, res: Response) => {
  try {
    const trackerId = parseInt(req.params.trackerId);
    if (isNaN(trackerId)) {
      return res.status(400).json({ error: 'Invalid tracker ID' });
    }

    // Validate request body
    const validationResult = conversionSchema.safeParse(req.body);
    if (!validationResult.success) {
      const errorMessage = fromZodError(validationResult.error).message;
      return res.status(400).json({ error: errorMessage });
    }

    const { sessionId, conversionType } = validationResult.data;

    // Find the hit by session ID and update its conversion status
    const hit = await storage.updateAdTrackerHitConversion(
      0, // This will be replaced by the actual hit ID in the storage implementation
      true,
      conversionType || 'lead',
      sessionId,
      trackerId
    );

    if (!hit) {
      return res.status(404).json({ error: 'No hit found for this session ID' });
    }

    res.status(200).json(hit);
  } catch (error) {
    console.error('Error recording conversion:', error);
    res.status(500).json({ error: 'Failed to record conversion' });
  }
};

/**
 * Get analytics data for a specific ad tracker
 */
export const getTrackerAnalytics = async (req: Request, res: Response) => {
  try {
    const trackerId = parseInt(req.params.trackerId);
    if (isNaN(trackerId)) {
      return res.status(400).json({ error: 'Invalid tracker ID' });
    }

    const timeRange = req.query.range as string || '7d';

    // Get total hits count
    const totalHits = await storage.getAdTrackerHitsCount(trackerId);
    
    // Get conversion rate
    const conversionRate = await storage.getAdTrackerConversionRate(trackerId);
    
    // Get hits by source
    const sourceBreakdown = await storage.getAdTrackerHitsBySources(trackerId);
    
    // Get hits by device type
    const deviceBreakdown = await storage.getAdTrackerHitsByDeviceType(trackerId);
    
    // Calculate the top source
    let topSource = 'direct';
    let topSourceCount = 0;
    for (const [source, count] of Object.entries(sourceBreakdown)) {
      if (count > topSourceCount) {
        topSource = source;
        topSourceCount = count;
      }
    }
    
    // Mock data for trending values and daily stats
    // In a real implementation, these would be calculated from historical data
    const response = {
      totalHits,
      totalConversions: Math.round(totalHits * (conversionRate / 100)),
      conversionRate: parseFloat(conversionRate.toFixed(2)),
      hitsTrend: 5.2,
      conversionsTrend: 3.7,
      conversionRateTrend: 1.2,
      topSource,
      topSourcePercentage: Math.round((topSourceCount / totalHits) * 100) || 0,
      trafficSources: sourceBreakdown,
      deviceTypes: deviceBreakdown,
      timeRange,
      dailyStats: [
        // This would be actual data in a real implementation
        { date: '2025-04-15', hits: 12, conversions: 3, conversionRate: 25, topSource: 'google' },
        { date: '2025-04-16', hits: 15, conversions: 4, conversionRate: 26.7, topSource: 'google' },
        { date: '2025-04-17', hits: 18, conversions: 5, conversionRate: 27.8, topSource: 'facebook' },
        { date: '2025-04-18', hits: 22, conversions: 7, conversionRate: 31.8, topSource: 'facebook' },
        { date: '2025-04-19', hits: 19, conversions: 6, conversionRate: 31.6, topSource: 'google' },
        { date: '2025-04-20', hits: 24, conversions: 8, conversionRate: 33.3, topSource: 'facebook' },
        { date: '2025-04-21', hits: 28, conversions: 10, conversionRate: 35.7, topSource: 'google' },
      ]
    };
    
    res.json(response);
  } catch (error) {
    console.error('Error getting tracker analytics:', error);
    res.status(500).json({ error: 'Failed to get analytics data' });
  }
};

/**
 * Generate a tracking URL with UTM parameters
 */
export const generateTrackingUrl = async (req: Request, res: Response) => {
  try {
    const { baseUrl, ...utmParams } = req.body;
    
    if (!baseUrl) {
      return res.status(400).json({ error: 'baseUrl is required' });
    }
    
    // Create a URL object
    const trackingUrl = new URL(baseUrl);
    
    // Add any UTM parameters provided in the request
    Object.entries(utmParams).forEach(([key, value]) => {
      if (value) {
        trackingUrl.searchParams.append(key, value as string);
      }
    });
    
    // Add a session ID if not provided
    if (!trackingUrl.searchParams.has('utm_session')) {
      const sessionId = 'session_' + Math.random().toString(36).substring(2, 12);
      trackingUrl.searchParams.append('utm_session', sessionId);
    }
    
    res.json({ url: trackingUrl.toString() });
  } catch (error) {
    console.error('Error generating tracking URL:', error);
    res.status(500).json({ error: 'Failed to generate tracking URL' });
  }
};