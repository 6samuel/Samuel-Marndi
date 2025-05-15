import { useEffect, useState, cloneElement, isValidElement, ReactNode, ReactElement, MouseEvent } from 'react';
import { recordTrackerHit, getUtmParams, getTrackingSessionId } from '@/lib/campaign-tracking';

interface CampaignTrackerProps {
  trackerId?: number;
  recordHitOnMount?: boolean;
  debug?: boolean;
}

/**
 * Component to track marketing campaign visits
 * Automatically records tracker hits and provides session information
 */
export default function CampaignTracker({
  trackerId = 1,
  recordHitOnMount = true,
  debug = false
}: CampaignTrackerProps) {
  const [isTracked, setIsTracked] = useState(false);
  
  useEffect(() => {
    // Only record hit if enabled and not already tracked in this session
    if (recordHitOnMount && !isTracked) {
      // Record page visit for the tracker
      recordTrackerHit(trackerId)
        .then(success => {
          setIsTracked(success);
          if (debug && success) {
            console.log('Campaign visit recorded successfully');
          }
        })
        .catch(error => {
          if (debug) {
            console.error('Error recording campaign visit:', error);
          }
        });
    }
    
    // Debug information if enabled
    if (debug) {
      const utmParams = getUtmParams();
      const sessionId = getTrackingSessionId();
      console.log('UTM Parameters:', utmParams);
      console.log('Tracking Session ID:', sessionId);
      console.log('Tracking URL Example:', generateExampleTrackingUrl());
    }
  }, [trackerId, recordHitOnMount, debug, isTracked]);
  
  // Doesn't render anything visible in the UI
  return null;
}

/**
 * Component that wraps conversion action elements and tracks their interactions
 */
export function TrackConversion({
  trackerId = 1,
  conversionType = 'lead',
  children,
  debug = false
}: {
  trackerId?: number;
  conversionType?: string;
  children: ReactNode;
  debug?: boolean;
}) {
  const handleConversion = async () => {
    try {
      const result = await fetch(`/api/ad-trackers/${trackerId}/conversion`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sessionId: getTrackingSessionId(),
          conversionType,
        }),
      });
      
      if (debug) {
        if (result.ok) {
          console.log(`Conversion "${conversionType}" recorded successfully`);
        } else {
          console.error('Error recording conversion:', await result.text());
        }
      }
    } catch (error) {
      if (debug) {
        console.error('Failed to record conversion:', error);
      }
    }
  };
  
  // Handle the click and record conversion
  const handleClick = async (e: MouseEvent, originalOnClick?: Function) => {
    // Call the original onClick if it exists
    if (originalOnClick) {
      originalOnClick(e);
    }
    
    // Record the conversion
    await handleConversion();
  };
  
  // Clone the child element and add the onClick handler
  if (isValidElement(children)) {
    const childElement = children as ReactElement;
    const originalOnClick = childElement.props.onClick;
    
    return cloneElement(
      childElement,
      {
        ...childElement.props,
        onClick: (e: MouseEvent) => handleClick(e, originalOnClick)
      }
    );
  }
  
  // If children isn't a valid element, just return it
  return <>{children}</>;
}

/**
 * Generate an example tracking URL for a marketing campaign
 */
function generateExampleTrackingUrl(): string {
  const trackingUrl = new URL(window.location.href);
  trackingUrl.searchParams.append('utm_id', '1');
  trackingUrl.searchParams.append('utm_source', 'google');
  trackingUrl.searchParams.append('utm_campaign', 'leads_2025');
  trackingUrl.searchParams.append('utm_session', 'session_' + Math.random().toString(36).substring(2, 12));
  return trackingUrl.toString();
}