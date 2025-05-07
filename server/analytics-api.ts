import { Request, Response } from 'express';
import { db } from './db';
import { eq, and, desc, sql, isNull, between, gte, lte } from 'drizzle-orm';
import { 
  marketingGoals, 
  marketingActivities,
  abTests,
  abTestVariants,
  abTestHits,
  adTrackers,
  adTrackerHits
} from '../shared/schema';

// Marketing goals API endpoints
export const getMarketingGoals = async (req: Request, res: Response) => {
  try {
    const allGoals = await db
      .select()
      .from(marketingGoals)
      .orderBy(desc(marketingGoals.createdAt));
    
    res.json(allGoals);
  } catch (error: any) {
    console.error('Error fetching marketing goals:', error);
    res.status(500).json({ message: error.message });
  }
};

export const getMarketingGoalById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const [goal] = await db
      .select()
      .from(marketingGoals)
      .where(eq(marketingGoals.id, parseInt(id)));
    
    if (!goal) {
      return res.status(404).json({ message: 'Goal not found' });
    }
    
    res.json(goal);
  } catch (error: any) {
    console.error(`Error fetching goal with ID ${req.params.id}:`, error);
    res.status(500).json({ message: error.message });
  }
};

export const createMarketingGoal = async (req: Request, res: Response) => {
  try {
    const [goal] = await db
      .insert(marketingGoals)
      .values(req.body)
      .returning();
    
    res.status(201).json(goal);
  } catch (error: any) {
    console.error('Error creating marketing goal:', error);
    res.status(500).json({ message: error.message });
  }
};

export const updateMarketingGoal = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const [goal] = await db
      .update(marketingGoals)
      .set({ ...req.body, updatedAt: new Date() })
      .where(eq(marketingGoals.id, parseInt(id)))
      .returning();
    
    if (!goal) {
      return res.status(404).json({ message: 'Goal not found' });
    }
    
    res.json(goal);
  } catch (error: any) {
    console.error(`Error updating goal with ID ${req.params.id}:`, error);
    res.status(500).json({ message: error.message });
  }
};

export const deleteMarketingGoal = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const result = await db
      .delete(marketingGoals)
      .where(eq(marketingGoals.id, parseInt(id)))
      .returning();
    
    if (!result.length) {
      return res.status(404).json({ message: 'Goal not found' });
    }
    
    res.json({ message: 'Goal deleted successfully' });
  } catch (error: any) {
    console.error(`Error deleting goal with ID ${req.params.id}:`, error);
    res.status(500).json({ message: error.message });
  }
};

// Marketing activities API endpoints
export const getMarketingActivities = async (req: Request, res: Response) => {
  try {
    const allActivities = await db
      .select()
      .from(marketingActivities)
      .orderBy(desc(marketingActivities.createdAt));
    
    res.json(allActivities);
  } catch (error: any) {
    console.error('Error fetching marketing activities:', error);
    res.status(500).json({ message: error.message });
  }
};

export const getMarketingActivityById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const [activity] = await db
      .select()
      .from(marketingActivities)
      .where(eq(marketingActivities.id, parseInt(id)));
    
    if (!activity) {
      return res.status(404).json({ message: 'Activity not found' });
    }
    
    res.json(activity);
  } catch (error: any) {
    console.error(`Error fetching activity with ID ${req.params.id}:`, error);
    res.status(500).json({ message: error.message });
  }
};

export const createMarketingActivity = async (req: Request, res: Response) => {
  try {
    const [activity] = await db
      .insert(marketingActivities)
      .values(req.body)
      .returning();
    
    res.status(201).json(activity);
  } catch (error: any) {
    console.error('Error creating marketing activity:', error);
    res.status(500).json({ message: error.message });
  }
};

export const updateMarketingActivity = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const [activity] = await db
      .update(marketingActivities)
      .set({ ...req.body, updatedAt: new Date() })
      .where(eq(marketingActivities.id, parseInt(id)))
      .returning();
    
    if (!activity) {
      return res.status(404).json({ message: 'Activity not found' });
    }
    
    res.json(activity);
  } catch (error: any) {
    console.error(`Error updating activity with ID ${req.params.id}:`, error);
    res.status(500).json({ message: error.message });
  }
};

export const deleteMarketingActivity = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const result = await db
      .delete(marketingActivities)
      .where(eq(marketingActivities.id, parseInt(id)))
      .returning();
    
    if (!result.length) {
      return res.status(404).json({ message: 'Activity not found' });
    }
    
    res.json({ message: 'Activity deleted successfully' });
  } catch (error: any) {
    console.error(`Error deleting activity with ID ${req.params.id}:`, error);
    res.status(500).json({ message: error.message });
  }
};

// A/B Testing API endpoints
export const getABTests = async (req: Request, res: Response) => {
  try {
    const allTests = await db
      .select()
      .from(abTests)
      .orderBy(desc(abTests.createdAt));
    
    res.json(allTests);
  } catch (error: any) {
    console.error('Error fetching A/B tests:', error);
    res.status(500).json({ message: error.message });
  }
};

export const getABTestById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const [test] = await db
      .select()
      .from(abTests)
      .where(eq(abTests.id, parseInt(id)));
    
    if (!test) {
      return res.status(404).json({ message: 'Test not found' });
    }
    
    res.json(test);
  } catch (error: any) {
    console.error(`Error fetching A/B test with ID ${req.params.id}:`, error);
    res.status(500).json({ message: error.message });
  }
};

export const createABTest = async (req: Request, res: Response) => {
  try {
    const [test] = await db
      .insert(abTests)
      .values(req.body)
      .returning();
    
    res.status(201).json(test);
  } catch (error: any) {
    console.error('Error creating A/B test:', error);
    res.status(500).json({ message: error.message });
  }
};

export const updateABTest = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const [test] = await db
      .update(abTests)
      .set({ ...req.body, updatedAt: new Date() })
      .where(eq(abTests.id, parseInt(id)))
      .returning();
    
    if (!test) {
      return res.status(404).json({ message: 'Test not found' });
    }
    
    res.json(test);
  } catch (error: any) {
    console.error(`Error updating A/B test with ID ${req.params.id}:`, error);
    res.status(500).json({ message: error.message });
  }
};

export const updateABTestStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    const [test] = await db
      .update(abTests)
      .set({ status, updatedAt: new Date() })
      .where(eq(abTests.id, parseInt(id)))
      .returning();
    
    if (!test) {
      return res.status(404).json({ message: 'Test not found' });
    }
    
    res.json(test);
  } catch (error: any) {
    console.error(`Error updating status for A/B test with ID ${req.params.id}:`, error);
    res.status(500).json({ message: error.message });
  }
};

export const deleteABTest = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const result = await db
      .delete(abTests)
      .where(eq(abTests.id, parseInt(id)))
      .returning();
    
    if (!result.length) {
      return res.status(404).json({ message: 'Test not found' });
    }
    
    res.json({ message: 'A/B test deleted successfully' });
  } catch (error: any) {
    console.error(`Error deleting A/B test with ID ${req.params.id}:`, error);
    res.status(500).json({ message: error.message });
  }
};

// A/B Test Variants API endpoints
export const getABTestVariants = async (req: Request, res: Response) => {
  try {
    const { testId } = req.params;
    
    const variants = await db
      .select()
      .from(abTestVariants)
      .where(eq(abTestVariants.testId, parseInt(testId)))
      .orderBy(abTestVariants.isControl, { direction: 'desc' });
    
    res.json(variants);
  } catch (error: any) {
    console.error(`Error fetching variants for test ID ${req.params.testId}:`, error);
    res.status(500).json({ message: error.message });
  }
};

export const createABTestVariant = async (req: Request, res: Response) => {
  try {
    const { testId } = req.params;
    const variantData = { ...req.body, testId: parseInt(testId) };
    
    // Check if this is marked as control and update other variants if needed
    if (variantData.isControl) {
      await db
        .update(abTestVariants)
        .set({ isControl: false })
        .where(
          and(
            eq(abTestVariants.testId, parseInt(testId)),
            eq(abTestVariants.isControl, true)
          )
        );
    }
    
    const [variant] = await db
      .insert(abTestVariants)
      .values(variantData)
      .returning();
    
    res.status(201).json(variant);
  } catch (error: any) {
    console.error('Error creating test variant:', error);
    res.status(500).json({ message: error.message });
  }
};

export const updateABTestVariant = async (req: Request, res: Response) => {
  try {
    const { testId, id } = req.params;
    const variantData = { ...req.body, updatedAt: new Date() };
    
    // Check if this is marked as control and update other variants if needed
    if (variantData.isControl) {
      await db
        .update(abTestVariants)
        .set({ isControl: false })
        .where(
          and(
            eq(abTestVariants.testId, parseInt(testId)),
            eq(abTestVariants.isControl, true),
            sql`${abTestVariants.id} != ${parseInt(id)}`
          )
        );
    }
    
    const [variant] = await db
      .update(abTestVariants)
      .set(variantData)
      .where(
        and(
          eq(abTestVariants.id, parseInt(id)),
          eq(abTestVariants.testId, parseInt(testId))
        )
      )
      .returning();
    
    if (!variant) {
      return res.status(404).json({ message: 'Variant not found' });
    }
    
    res.json(variant);
  } catch (error: any) {
    console.error(`Error updating variant with ID ${req.params.id}:`, error);
    res.status(500).json({ message: error.message });
  }
};

export const deleteABTestVariant = async (req: Request, res: Response) => {
  try {
    const { testId, id } = req.params;
    
    // Check if this is the control variant
    const [variant] = await db
      .select()
      .from(abTestVariants)
      .where(
        and(
          eq(abTestVariants.id, parseInt(id)),
          eq(abTestVariants.testId, parseInt(testId))
        )
      );
    
    if (!variant) {
      return res.status(404).json({ message: 'Variant not found' });
    }
    
    // Don't allow deleting the control if there are other variants
    if (variant.isControl) {
      const otherVariantsCount = await db
        .select({ count: sql<number>`count(*)` })
        .from(abTestVariants)
        .where(
          and(
            eq(abTestVariants.testId, parseInt(testId)),
            sql`${abTestVariants.id} != ${parseInt(id)}`
          )
        );
      
      if (otherVariantsCount[0].count > 0) {
        return res.status(400).json({ 
          message: 'Cannot delete control variant while other variants exist. Make another variant the control first.' 
        });
      }
    }
    
    const result = await db
      .delete(abTestVariants)
      .where(
        and(
          eq(abTestVariants.id, parseInt(id)),
          eq(abTestVariants.testId, parseInt(testId))
        )
      )
      .returning();
    
    res.json({ message: 'Variant deleted successfully' });
  } catch (error: any) {
    console.error(`Error deleting variant with ID ${req.params.id}:`, error);
    res.status(500).json({ message: error.message });
  }
};

// Track A/B test impressions and conversions
export const recordABTestImpression = async (req: Request, res: Response) => {
  try {
    const { variantId } = req.params;
    const { sessionId, ipAddress, userAgent, deviceType } = req.body;
    
    // Record the hit
    const [hit] = await db
      .insert(abTestHits)
      .values({
        variantId: parseInt(variantId),
        sessionId,
        ipAddress,
        userAgent,
        deviceType,
        converted: false
      })
      .returning();
    
    // Update impression count for the variant
    await db
      .update(abTestVariants)
      .set({ 
        impressions: sql`${abTestVariants.impressions} + 1`,
        conversionRate: sql`CASE WHEN ${abTestVariants.impressions} > 0 
          THEN (${abTestVariants.conversions}::float / (${abTestVariants.impressions} + 1)) * 100 
          ELSE 0 END`
      })
      .where(eq(abTestVariants.id, parseInt(variantId)));
    
    res.status(201).json(hit);
  } catch (error: any) {
    console.error('Error recording A/B test impression:', error);
    res.status(500).json({ message: error.message });
  }
};

export const recordABTestConversion = async (req: Request, res: Response) => {
  try {
    const { variantId } = req.params;
    const { sessionId } = req.body;
    
    // Update the hit to mark it as converted
    const [hit] = await db
      .update(abTestHits)
      .set({ converted: true })
      .where(
        and(
          eq(abTestHits.variantId, parseInt(variantId)),
          eq(abTestHits.sessionId, sessionId),
          eq(abTestHits.converted, false)
        )
      )
      .returning();
    
    if (!hit) {
      return res.status(404).json({ message: 'No matching impression found for this session' });
    }
    
    // Update conversion count for the variant
    await db
      .update(abTestVariants)
      .set({ 
        conversions: sql`${abTestVariants.conversions} + 1`,
        conversionRate: sql`CASE WHEN ${abTestVariants.impressions} > 0 
          THEN (${abTestVariants.conversions} + 1)::float / ${abTestVariants.impressions} * 100 
          ELSE 0 END`
      })
      .where(eq(abTestVariants.id, parseInt(variantId)));
    
    res.json(hit);
  } catch (error: any) {
    console.error('Error recording A/B test conversion:', error);
    res.status(500).json({ message: error.message });
  }
};

// Get A/B test results
export const getABTestResults = async (req: Request, res: Response) => {
  try {
    const { testId } = req.params;
    
    // Get test details
    const [test] = await db
      .select()
      .from(abTests)
      .where(eq(abTests.id, parseInt(testId)));
    
    if (!test) {
      return res.status(404).json({ message: 'Test not found' });
    }
    
    // Get variants with metrics
    const variants = await db
      .select()
      .from(abTestVariants)
      .where(eq(abTestVariants.testId, parseInt(testId)))
      .orderBy(abTestVariants.isControl, { direction: 'desc' });
    
    if (!variants.length) {
      return res.json({
        testId: parseInt(testId),
        totalImpressions: 0,
        totalConversions: 0,
        averageConversionRate: 0,
        confidenceLevel: 0,
        winner: null,
        variants: [],
        timeline: []
      });
    }
    
    // Calculate overall metrics
    const totalImpressions = variants.reduce((sum, variant) => sum + variant.impressions, 0);
    const totalConversions = variants.reduce((sum, variant) => sum + variant.conversions, 0);
    const averageConversionRate = totalImpressions > 0 
      ? (totalConversions / totalImpressions) * 100 
      : 0;
    
    // Find control variant and calculate improvements
    const controlVariant = variants.find(v => v.isControl);
    const controlRate = controlVariant?.conversionRate || 0;
    
    const variantsWithImprovement = variants.map(variant => ({
      ...variant,
      improvement: !variant.isControl && controlRate > 0 
        ? ((variant.conversionRate - controlRate) / controlRate) * 100 
        : null
    }));
    
    // Determine winner (simplified logic - in a real implementation, would use statistical significance)
    let winner = null;
    let confidenceLevel = 0;
    
    if (totalImpressions >= test.targetSampleSize && controlVariant) {
      // Sample calculations for demonstration
      // Find best performing variant
      const bestVariant = variantsWithImprovement.reduce((best, current) => {
        if (current.isControl) return best;
        if (!best) return current;
        return current.conversionRate > best.conversionRate ? current : best;
      }, null as (typeof variantsWithImprovement[0] | null));
      
      if (bestVariant && bestVariant.improvement && bestVariant.improvement > 0) {
        // Simplified confidence calculation - in real implementation, would use statistical methods
        const sampleSizeFactor = Math.min(totalImpressions / test.targetSampleSize, 1);
        const improvementFactor = Math.min(bestVariant.improvement / 10, 1);
        
        confidenceLevel = sampleSizeFactor * improvementFactor * 100;
        
        if (confidenceLevel >= test.minimumConfidence) {
          winner = bestVariant.id;
        }
      }
    }
    
    // Get timeline data (simplified - in real implementation would aggregate by date)
    const hits = await db
      .select({
        variantId: abTestHits.variantId,
        date: sql<string>`to_char(${abTestHits.timestamp}, 'YYYY-MM-DD')`,
        impressions: sql<number>`count(*)`,
        conversions: sql<number>`sum(case when ${abTestHits.converted} then 1 else 0 end)`
      })
      .from(abTestHits)
      .where(
        and(
          sql`${abTestHits.variantId} IN (SELECT id FROM ab_test_variants WHERE test_id = ${parseInt(testId)})`,
          ...(test.startDate ? [gte(abTestHits.timestamp, test.startDate)] : []),
          ...(test.endDate ? [lte(abTestHits.timestamp, test.endDate)] : [])
        )
      )
      .groupBy(abTestHits.variantId, sql`to_char(${abTestHits.timestamp}, 'YYYY-MM-DD')`)
      .orderBy(sql`to_char(${abTestHits.timestamp}, 'YYYY-MM-DD')`);
    
    res.json({
      testId: parseInt(testId),
      totalImpressions,
      totalConversions,
      averageConversionRate,
      confidenceLevel,
      winner,
      variants: variantsWithImprovement,
      timeline: hits
    });
    
  } catch (error: any) {
    console.error(`Error getting results for test ID ${req.params.testId}:`, error);
    res.status(500).json({ message: error.message });
  }
};