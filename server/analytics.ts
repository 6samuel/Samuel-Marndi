import { Request, Response } from 'express';
import { db } from './db';
import { adTrackerHits, adTrackers } from '@shared/schema';
import { eq, and, gte, sql, desc, count } from 'drizzle-orm';

// Helper function to get start date based on time range
const getStartDateFromRange = (range: string): Date => {
  const now = new Date();
  switch (range) {
    case '7d':
      return new Date(now.setDate(now.getDate() - 7));
    case '30d':
      return new Date(now.setDate(now.getDate() - 30));
    case '90d':
      return new Date(now.setDate(now.getDate() - 90));
    case '6m':
      return new Date(now.setMonth(now.getMonth() - 6));
    case '1y':
      return new Date(now.setFullYear(now.getFullYear() - 1));
    default:
      return new Date(now.setDate(now.getDate() - 7)); // Default to 7 days
  }
};

// Format date for grouping in SQL
const formatDateForGrouping = (date: Date): string => {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
};

// Get analytics overview data
export const getAnalyticsOverview = async (req: Request, res: Response) => {
  try {
    // Get query parameters
    const timeRange = (req.query.timeRange as string) || '7d';
    const trackerId = req.query.trackerId ? parseInt(req.query.trackerId as string) : null;
    
    // Get start date based on time range
    const startDate = getStartDateFromRange(timeRange);
    
    // Get previous period start date for comparison
    const previousPeriodStartDate = new Date(startDate);
    switch (timeRange) {
      case '7d':
        previousPeriodStartDate.setDate(previousPeriodStartDate.getDate() - 7);
        break;
      case '30d':
        previousPeriodStartDate.setDate(previousPeriodStartDate.getDate() - 30);
        break;
      case '90d':
        previousPeriodStartDate.setDate(previousPeriodStartDate.getDate() - 90);
        break;
      case '6m':
        previousPeriodStartDate.setMonth(previousPeriodStartDate.getMonth() - 6);
        break;
      case '1y':
        previousPeriodStartDate.setFullYear(previousPeriodStartDate.getFullYear() - 1);
        break;
    }
    
    // Query current period data
    let currentPeriodQuery = db.select({
      count: sql<number>`count(*)`,
      conversions: sql<number>`count(case when ${adTrackerHits.converted} = true then 1 end)`,
    })
    .from(adTrackerHits)
    .where(
      and(
        gte(adTrackerHits.createdAt, startDate),
        trackerId ? eq(adTrackerHits.trackerId, trackerId) : sql`1=1`
      )
    );
    
    // Query previous period data
    let previousPeriodQuery = db.select({
      count: sql<number>`count(*)`,
      conversions: sql<number>`count(case when ${adTrackerHits.converted} = true then 1 end)`,
    })
    .from(adTrackerHits)
    .where(
      and(
        gte(adTrackerHits.createdAt, previousPeriodStartDate),
        adTrackerHits.createdAt < startDate,
        trackerId ? eq(adTrackerHits.trackerId, trackerId) : sql`1=1`
      )
    );
    
    // Query by source
    let bySourceQuery = db.select({
      source: adTrackerHits.utmSource,
      count: sql<number>`count(*)`,
    })
    .from(adTrackerHits)
    .where(
      and(
        gte(adTrackerHits.createdAt, startDate),
        trackerId ? eq(adTrackerHits.trackerId, trackerId) : sql`1=1`
      )
    )
    .groupBy(adTrackerHits.utmSource)
    .orderBy(desc(sql<number>`count(*)`));
    
    // Query by device
    let byDeviceQuery = db.select({
      device: adTrackerHits.deviceType,
      count: sql<number>`count(*)`,
    })
    .from(adTrackerHits)
    .where(
      and(
        gte(adTrackerHits.createdAt, startDate),
        trackerId ? eq(adTrackerHits.trackerId, trackerId) : sql`1=1`
      )
    )
    .groupBy(adTrackerHits.deviceType)
    .orderBy(desc(sql<number>`count(*)`));
    
    // Query daily visits
    let dailyVisitsQuery = db.select({
      date: sql<string>`date_trunc('day', ${adTrackerHits.createdAt})::date::text`,
      count: sql<number>`count(*)`,
    })
    .from(adTrackerHits)
    .where(
      and(
        gte(adTrackerHits.createdAt, startDate),
        trackerId ? eq(adTrackerHits.trackerId, trackerId) : sql`1=1`
      )
    )
    .groupBy(sql`date_trunc('day', ${adTrackerHits.createdAt})::date::text`)
    .orderBy(sql`date_trunc('day', ${adTrackerHits.createdAt})::date::text`);
    
    // Query daily conversions
    let dailyConversionsQuery = db.select({
      date: sql<string>`date_trunc('day', ${adTrackerHits.createdAt})::date::text`,
      count: sql<number>`count(*)`,
    })
    .from(adTrackerHits)
    .where(
      and(
        gte(adTrackerHits.createdAt, startDate),
        eq(adTrackerHits.converted, true),
        trackerId ? eq(adTrackerHits.trackerId, trackerId) : sql`1=1`
      )
    )
    .groupBy(sql`date_trunc('day', ${adTrackerHits.createdAt})::date::text`)
    .orderBy(sql`date_trunc('day', ${adTrackerHits.createdAt})::date::text`);
    
    // Execute all queries in parallel
    const [
      currentPeriodResults, 
      previousPeriodResults, 
      bySourceResults, 
      byDeviceResults,
      dailyVisitsResults,
      dailyConversionsResults
    ] = await Promise.all([
      currentPeriodQuery,
      previousPeriodQuery,
      bySourceQuery,
      byDeviceQuery,
      dailyVisitsQuery,
      dailyConversionsQuery
    ]);
    
    // Extract data from results
    const currentPeriod = currentPeriodResults[0] || { count: 0, conversions: 0 };
    const previousPeriod = previousPeriodResults[0] || { count: 0, conversions: 0 };
    
    // Convert source results to object
    const bySource: Record<string, number> = {};
    bySourceResults.forEach(item => {
      bySource[item.source || 'direct'] = item.count;
    });
    
    // Convert device results to object
    const byDevice: Record<string, number> = {};
    byDeviceResults.forEach(item => {
      byDevice[item.device || 'unknown'] = item.count;
    });
    
    // Prepare response data
    const responseData = {
      totalVisits: currentPeriod.count,
      totalConversions: currentPeriod.conversions,
      conversionRate: currentPeriod.count > 0 
        ? (currentPeriod.conversions / currentPeriod.count) * 100 
        : 0,
      previousPeriodVisits: previousPeriod.count,
      previousPeriodConversions: previousPeriod.conversions,
      bySource,
      byDevice,
      dailyVisits: dailyVisitsResults,
      dailyConversions: dailyConversionsResults,
    };
    
    res.json(responseData);
  } catch (error) {
    console.error('Error getting analytics overview:', error);
    res.status(500).json({ error: 'Failed to get analytics data' });
  }
};

// Get single tracker analytics
export const getTrackerAnalytics = async (req: Request, res: Response) => {
  try {
    const trackerId = parseInt(req.params.trackerId);
    const timeRange = (req.query.timeRange as string) || '7d';
    
    // Get start date based on time range
    const startDate = getStartDateFromRange(timeRange);
    
    // Fetch tracker data
    const tracker = await db.select().from(adTrackers).where(eq(adTrackers.id, trackerId)).limit(1);
    
    if (!tracker.length) {
      return res.status(404).json({ error: 'Tracker not found' });
    }
    
    // Get hits count
    const hitsCountQuery = db.select({
      count: sql<number>`count(*)`,
    })
    .from(adTrackerHits)
    .where(
      and(
        eq(adTrackerHits.trackerId, trackerId),
        gte(adTrackerHits.createdAt, startDate)
      )
    );
    
    // Get conversions count
    const conversionsCountQuery = db.select({
      count: sql<number>`count(*)`,
    })
    .from(adTrackerHits)
    .where(
      and(
        eq(adTrackerHits.trackerId, trackerId),
        eq(adTrackerHits.converted, true),
        gte(adTrackerHits.createdAt, startDate)
      )
    );
    
    // Execute queries in parallel
    const [hitsCountResult, conversionsCountResult] = await Promise.all([
      hitsCountQuery,
      conversionsCountQuery,
    ]);
    
    // Extract data from results
    const hitsCount = hitsCountResult[0]?.count || 0;
    const conversionsCount = conversionsCountResult[0]?.count || 0;
    
    // Calculate conversion rate
    const conversionRate = hitsCount > 0 ? (conversionsCount / hitsCount) * 100 : 0;
    
    res.json({
      tracker: tracker[0],
      hits: hitsCount,
      conversions: conversionsCount,
      conversionRate,
    });
  } catch (error) {
    console.error('Error getting tracker analytics:', error);
    res.status(500).json({ error: 'Failed to get tracker analytics' });
  }
};

// Get analytics data for dashboard widgets
export const getAnalyticsDashboardData = async (req: Request, res: Response) => {
  try {
    // Get active trackers count
    const activeTrackersCountQuery = db.select({
      count: sql<number>`count(*)`,
    })
    .from(adTrackers)
    .where(eq(adTrackers.active, true));
    
    // Get total trackers count
    const totalTrackersCountQuery = db.select({
      count: sql<number>`count(*)`,
    })
    .from(adTrackers);
    
    // Get total hits in the last 30 days
    const last30DaysHitsCountQuery = db.select({
      count: sql<number>`count(*)`,
    })
    .from(adTrackerHits)
    .where(gte(adTrackerHits.createdAt, getStartDateFromRange('30d')));
    
    // Get total conversions in the last 30 days
    const last30DaysConversionsCountQuery = db.select({
      count: sql<number>`count(*)`,
    })
    .from(adTrackerHits)
    .where(
      and(
        gte(adTrackerHits.createdAt, getStartDateFromRange('30d')),
        eq(adTrackerHits.converted, true)
      )
    );
    
    // Execute queries in parallel
    const [
      activeTrackersCountResult,
      totalTrackersCountResult,
      last30DaysHitsCountResult,
      last30DaysConversionsCountResult
    ] = await Promise.all([
      activeTrackersCountQuery,
      totalTrackersCountQuery,
      last30DaysHitsCountQuery,
      last30DaysConversionsCountQuery
    ]);
    
    // Extract data from results
    const activeTrackersCount = activeTrackersCountResult[0]?.count || 0;
    const totalTrackersCount = totalTrackersCountResult[0]?.count || 0;
    const last30DaysHitsCount = last30DaysHitsCountResult[0]?.count || 0;
    const last30DaysConversionsCount = last30DaysConversionsCountResult[0]?.count || 0;
    
    // Calculate conversion rate
    const conversionRate = last30DaysHitsCount > 0 
      ? (last30DaysConversionsCount / last30DaysHitsCount) * 100 
      : 0;
    
    res.json({
      activeTrackersCount,
      totalTrackersCount,
      last30DaysHitsCount,
      last30DaysConversionsCount,
      conversionRate,
    });
  } catch (error) {
    console.error('Error getting analytics dashboard data:', error);
    res.status(500).json({ error: 'Failed to get analytics dashboard data' });
  }
};

// Get conversion analytics
export const getConversionAnalytics = async (req: Request, res: Response) => {
  try {
    const timeRange = (req.query.timeRange as string) || '30d';
    const trackerId = req.query.trackerId ? parseInt(req.query.trackerId as string) : null;
    
    // Get start date based on time range
    const startDate = getStartDateFromRange(timeRange);
    
    // Get conversion rates by source
    const conversionsBySourceQuery = db.select({
      source: adTrackerHits.utmSource,
      totalHits: sql<number>`count(*)`,
      conversions: sql<number>`count(case when ${adTrackerHits.converted} = true then 1 end)`,
    })
    .from(adTrackerHits)
    .where(
      and(
        gte(adTrackerHits.createdAt, startDate),
        trackerId ? eq(adTrackerHits.trackerId, trackerId) : sql`1=1`
      )
    )
    .groupBy(adTrackerHits.utmSource)
    .orderBy(desc(sql<number>`count(*)`));
    
    // Get conversion rates by device
    const conversionsByDeviceQuery = db.select({
      device: adTrackerHits.deviceType,
      totalHits: sql<number>`count(*)`,
      conversions: sql<number>`count(case when ${adTrackerHits.converted} = true then 1 end)`,
    })
    .from(adTrackerHits)
    .where(
      and(
        gte(adTrackerHits.createdAt, startDate),
        trackerId ? eq(adTrackerHits.trackerId, trackerId) : sql`1=1`
      )
    )
    .groupBy(adTrackerHits.deviceType)
    .orderBy(desc(sql<number>`count(*)`));
    
    // Get daily conversion rates
    const dailyConversionRatesQuery = db.select({
      date: sql<string>`date_trunc('day', ${adTrackerHits.createdAt})::date::text`,
      totalHits: sql<number>`count(*)`,
      conversions: sql<number>`count(case when ${adTrackerHits.converted} = true then 1 end)`,
    })
    .from(adTrackerHits)
    .where(
      and(
        gte(adTrackerHits.createdAt, startDate),
        trackerId ? eq(adTrackerHits.trackerId, trackerId) : sql`1=1`
      )
    )
    .groupBy(sql`date_trunc('day', ${adTrackerHits.createdAt})::date::text`)
    .orderBy(sql`date_trunc('day', ${adTrackerHits.createdAt})::date::text`);
    
    // Execute queries in parallel
    const [
      conversionsBySourceResults,
      conversionsByDeviceResults,
      dailyConversionRatesResults
    ] = await Promise.all([
      conversionsBySourceQuery,
      conversionsByDeviceQuery,
      dailyConversionRatesQuery
    ]);
    
    // Process data for response
    const conversionsBySource = conversionsBySourceResults.map(item => ({
      source: item.source || 'direct',
      totalHits: item.totalHits,
      conversions: item.conversions,
      conversionRate: item.totalHits > 0 ? (item.conversions / item.totalHits) * 100 : 0,
    }));
    
    const conversionsByDevice = conversionsByDeviceResults.map(item => ({
      device: item.device || 'unknown',
      totalHits: item.totalHits,
      conversions: item.conversions,
      conversionRate: item.totalHits > 0 ? (item.conversions / item.totalHits) * 100 : 0,
    }));
    
    const dailyConversionRates = dailyConversionRatesResults.map(item => ({
      date: item.date,
      totalHits: item.totalHits,
      conversions: item.conversions,
      conversionRate: item.totalHits > 0 ? (item.conversions / item.totalHits) * 100 : 0,
    }));
    
    res.json({
      conversionsBySource,
      conversionsByDevice,
      dailyConversionRates,
    });
  } catch (error) {
    console.error('Error getting conversion analytics:', error);
    res.status(500).json({ error: 'Failed to get conversion analytics' });
  }
};