import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Platform,
  Linking,
  Alert,
} from 'react-native';
import { VolumeX, Volume2 } from 'lucide-react-native';
import { AdFeedItem as AdFeedItemType } from '@/types';
import { Video, ResizeMode, AVPlaybackStatus } from 'expo-av';
import { useAdAnalytics } from '@/hooks/useFirebaseAds';

const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get('window');

interface AdFeedItemProps {
  ad: AdFeedItemType;
  isActive?: boolean;
}

export default function AdFeedItem({ ad, isActive = true }: AdFeedItemProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [isMuted, setIsMuted] = useState(false); // Start unmuted like regular videos
  const [isBuffering, setIsBuffering] = useState(false);
  const [hasTrackedImpression, setHasTrackedImpression] = useState(false);
  const videoRef = useRef<Video>(null);
  const { trackImpression, trackClick } = useAdAnalytics();

  // Track impression when ad becomes visible
  useEffect(() => {
    if (isActive && !hasTrackedImpression) {
      trackImpression(ad.id);
      setHasTrackedImpression(true);
    }
  }, [isActive, hasTrackedImpression, ad.id, trackImpression]);

  // Auto-play/pause based on active state
  useEffect(() => {
    if (videoRef.current) {
      if (isActive) {
        videoRef.current.playAsync();
      } else {
        videoRef.current.pauseAsync();
      }
    }
  }, [isActive]);

  const handleAdClick = async () => {
    try {
      // Track the click
      await trackClick(ad.id);
      
      // Open the destination URL
      const supported = await Linking.canOpenURL(ad.destinationUrl);
      
      if (supported) {
        await Linking.openURL(ad.destinationUrl);
      } else {
        Alert.alert(
          'Unable to Open Link',
          'Cannot open the advertisement link at this time.',
          [{ text: 'OK', style: 'default' }]
        );
      }
    } catch (error) {
      console.error('Error opening ad link:', error);
      Alert.alert(
        'Link Error',
        'Unable to open the advertisement link. Please try again.',
        [{ text: 'OK', style: 'default' }]
      );
    }
  };

  const handleMuteToggle = () => {
    if (videoRef.current) {
      videoRef.current.setIsMutedAsync(!isMuted);
      setIsMuted(!isMuted);
    }
  };

  const handlePlaybackStatusUpdate = (status: AVPlaybackStatus) => {
    if (status.isLoaded) {
      setIsLoading(false);
      setIsBuffering(status.isBuffering || false);
      
      if (status.didJustFinish) {
        // Loop the video
        videoRef.current?.replayAsync();
      }
    } else if (status.error) {
      console.error('Ad video playback error:', status.error);
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* Video Content - Auto-playing with sound like regular videos */}
      <TouchableOpacity 
        style={styles.mediaContainer} 
        onPress={handleAdClick}
        activeOpacity={1}
      >
        <Video
          ref={videoRef}
          source={{ uri: ad.mediaUrl }}
          style={styles.media}
          resizeMode={ResizeMode.COVER}
          shouldPlay={isActive} // Auto-play when active
          isLooping={true}
          isMuted={isMuted} // Controlled by user, starts unmuted
          volume={1.0} // Full volume
          rate={1.0} // Normal playback speed
          onPlaybackStatusUpdate={handlePlaybackStatusUpdate}
          // Performance optimizations
          useNativeControls={false}
          progressUpdateIntervalMillis={1000}
          positionMillis={0}
        />

        {/* Loading/Buffering Indicator */}
        {(isLoading || isBuffering) && (
          <View style={styles.loadingOverlay}>
            <View style={styles.loadingSpinner} />
            <Text style={styles.loadingText}>
              {isLoading ? 'Loading ad...' : 'Buffering...'}
            </Text>
          </View>
        )}

        {/* Mute/Unmute Button */}
        <TouchableOpacity 
          style={styles.muteButton}
          onPress={handleMuteToggle}
          activeOpacity={0.8}
        >
          {isMuted ? (
            <VolumeX size={20} color="#FFFFFF" />
          ) : (
            <Volume2 size={20} color="#FFFFFF" />
          )}
        </TouchableOpacity>
      </TouchableOpacity>
      
      {/* Bottom Content - Full Width Layout */}
      <View style={styles.bottomContent}>
        {/* Call to Action Button - Full Width */}
        <TouchableOpacity 
          style={styles.ctaButton}
          onPress={handleAdClick}
          activeOpacity={0.8}
        >
          <Text style={styles.ctaButtonText}>{ad.callToAction}</Text>
        </TouchableOpacity>
        
        {/* Sponsored Text - Centered Below Button */}
        <Text style={styles.sponsoredText}>Sponsored</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: SCREEN_HEIGHT,
    width: SCREEN_WIDTH,
    position: 'relative',
    backgroundColor: '#000000',
  },
  mediaContainer: {
    width: '100%',
    height: '100%',
    position: 'relative',
  },
  media: {
    width: '100%',
    height: '100%',
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  loadingSpinner: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 3,
    borderColor: 'rgba(255,255,255,0.3)',
    borderTopColor: '#FFFFFF',
    marginBottom: 12,
  },
  loadingText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    textAlign: 'center',
  },
  muteButton: {
    position: 'absolute',
    top: 60,
    right: 16,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 20,
    padding: 8,
    zIndex: 10,
  },
  bottomContent: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: Platform.OS === 'ios' ? 120 : 100,
  },
  ctaButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    paddingHorizontal: 40,
    paddingVertical: 16,
    borderRadius: 30,
    width: SCREEN_WIDTH - 40,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8,
    marginBottom: 16,
  },
  ctaButtonText: {
    color: '#000000',
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    fontWeight: '700',
    textAlign: 'center',
    letterSpacing: 0.5,
  },
  sponsoredText: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    textShadowColor: 'rgba(0, 0, 0, 0.8)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
    textAlign: 'center',
  },
});