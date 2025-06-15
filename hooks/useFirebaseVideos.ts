import { useState, useEffect } from 'react';
import { ref, onValue, off } from 'firebase/database';
import { database } from '@/config/firebase';
import { VideoProduct, VideoFeedItem, AdFeedItem, FeedItem } from '@/types';
import { useFirebaseAds } from './useFirebaseAds';

export function useFirebaseVideos() {
  const [videos, setVideos] = useState<VideoFeedItem[]>([]);
  const [feedItems, setFeedItems] = useState<FeedItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Get ads from Firebase
  const { ads, loading: adsLoading, error: adsError } = useFirebaseAds();

  useEffect(() => {
    const videosRef = ref(database, 'videoProducts');
    
    const unsubscribe = onValue(
      videosRef,
      (snapshot) => {
        try {
          const data = snapshot.val();
          
          if (data) {
            // Transform Firebase data to VideoFeedItem format
            const transformedVideos: VideoFeedItem[] = Object.entries(data).map(([key, value]) => {
              const videoProduct = value as VideoProduct;
              
              return {
                id: key,
                type: 'video' as const,
                videoUrl: videoProduct.videoUrl,
                thumbnailUrl: videoProduct.thumbnailUrl,
                product: {
                  name: videoProduct.title,
                  price: `${videoProduct.currency} ${videoProduct.price}`,
                  category: 'Product', // Default category since not in original data
                  productUrl: videoProduct.productUrl,
                },
                likes: Math.floor(Math.random() * 5000) + 100, // Random likes for demo
                comments: Math.floor(Math.random() * 500) + 10, // Random comments for demo
                isLiked: false,
              };
            });

            // Sort by creation date (newest first)
            transformedVideos.sort((a, b) => {
              const aProduct = data[a.id] as VideoProduct;
              const bProduct = data[b.id] as VideoProduct;
              return bProduct.createdAt - aProduct.createdAt;
            });

            setVideos(transformedVideos);
          } else {
            setVideos([]);
          }
          
          setLoading(false);
          setError(null);
        } catch (err) {
          console.error('Error processing video data:', err);
          setError('Failed to load videos');
          setLoading(false);
        }
      },
      (error) => {
        console.error('Firebase error:', error);
        setError('Failed to connect to database');
        setLoading(false);
      }
    );

    // Cleanup function
    return () => {
      off(videosRef, 'value', unsubscribe);
    };
  }, []);

  // Combine videos and ads when both are loaded
  useEffect(() => {
    if (!loading && !adsLoading && videos.length > 0) {
      const combinedFeed = createFeedWithAds(videos, ads);
      setFeedItems(combinedFeed);
    } else if (!loading && !adsLoading) {
      // If no videos or ads, just set videos
      setFeedItems(videos);
    }
  }, [videos, ads, loading, adsLoading]);

  return { 
    videos, 
    feedItems, 
    loading: loading || adsLoading, 
    error: error || adsError 
  };
}

// Function to insert ads after every 2 videos
function createFeedWithAds(videos: VideoFeedItem[], ads: AdFeedItem[]): FeedItem[] {
  if (ads.length === 0) {
    return videos; // Return videos only if no ads available
  }

  const combinedFeed: FeedItem[] = [];
  let adIndex = 0;

  for (let i = 0; i < videos.length; i++) {
    // Add the video
    combinedFeed.push(videos[i]);

    // After every 2 videos (positions 2, 4, 6, etc.), insert an ad
    if ((i + 1) % 2 === 0 && adIndex < ads.length) {
      combinedFeed.push(ads[adIndex]);
      adIndex++;
      
      // Reset ad index to cycle through ads if we have more insertion points than ads
      if (adIndex >= ads.length) {
        adIndex = 0;
      }
    }
  }

  return combinedFeed;
}