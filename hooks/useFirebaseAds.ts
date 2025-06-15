import { useState, useEffect } from 'react';
import { ref, onValue, off } from 'firebase/database';
import { database } from '@/config/firebase';
import { FirebaseAd, AdFeedItem } from '@/types';

export function useFirebaseAds() {
  const [ads, setAds] = useState<AdFeedItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const adsRef = ref(database, 'advertisements');
    
    const unsubscribe = onValue(
      adsRef,
      (snapshot) => {
        try {
          const data = snapshot.val();
          
          if (data) {
            // Transform Firebase ads to AdFeedItem format - ONLY VIDEO ADS
            const transformedAds: AdFeedItem[] = Object.entries(data)
              .map(([key, value]) => {
                const firebaseAd = value as FirebaseAd;
                
                // Only include active VIDEO ads
                if (!firebaseAd.isActive || firebaseAd.adType !== 'video') {
                  return null;
                }
                
                return {
                  id: key,
                  type: 'ad' as const,
                  adType: 'video' as const, // Only video ads
                  mediaUrl: firebaseAd.mediaUrl,
                  title: firebaseAd.title,
                  callToAction: firebaseAd.callToAction,
                  destinationUrl: firebaseAd.destinationUrl,
                };
              })
              .filter((ad): ad is AdFeedItem => ad !== null);

            // Sort by creation date (newest first)
            transformedAds.sort((a, b) => {
              const aAd = data[a.id] as FirebaseAd;
              const bAd = data[b.id] as FirebaseAd;
              return bAd.createdAt - aAd.createdAt;
            });

            setAds(transformedAds);
          } else {
            setAds([]);
          }
          
          setLoading(false);
          setError(null);
        } catch (err) {
          console.error('Error processing ads data:', err);
          setError('Failed to load ads');
          setLoading(false);
        }
      },
      (error) => {
        console.error('Firebase ads error:', error);
        setError('Failed to connect to ads database');
        setLoading(false);
      }
    );

    // Cleanup function
    return () => {
      off(adsRef, 'value', unsubscribe);
    };
  }, []);

  return { ads, loading, error };
}

// Hook to track ad impressions and clicks
export function useAdAnalytics() {
  const trackImpression = async (adId: string) => {
    try {
      // In a real app, you would increment the impression count in Firebase
      console.log('Ad impression tracked:', adId);
      
      // Example implementation:
      // const impressionsRef = ref(database, `advertisements/${adId}/analytics/impressions`);
      // const currentImpressions = await get(impressionsRef);
      // await set(impressionsRef, (currentImpressions.val() || 0) + 1);
    } catch (error) {
      console.error('Error tracking impression:', error);
    }
  };

  const trackClick = async (adId: string) => {
    try {
      // In a real app, you would increment the click count in Firebase
      console.log('Ad click tracked:', adId);
      
      // Example implementation:
      // const clicksRef = ref(database, `advertisements/${adId}/analytics/clicks`);
      // const currentClicks = await get(clicksRef);
      // await set(clicksRef, (currentClicks.val() || 0) + 1);
    } catch (error) {
      console.error('Error tracking click:', error);
    }
  };

  return { trackImpression, trackClick };
}