import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Platform,
  Linking,
  Share,
  Alert,
} from 'react-native';
import { Heart, MessageCircle, Share as ShareIcon, ExternalLink, Play, Pause, VolumeX, Volume2 } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { VideoFeedItem as VideoFeedItemType } from '@/types';
import { Video, ResizeMode, AVPlaybackStatus } from 'expo-av';
import { useVideoStats } from '@/hooks/useFirebaseInteractions';
import CommentsModal from './CommentsModal';

const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get('window');

interface VideoFeedItemProps {
  video: VideoFeedItemType;
  isActive?: boolean;
}

export default function VideoFeedItem({ video, isActive = true }: VideoFeedItemProps) {
  const [isPlaying, setIsPlaying] = useState(isActive);
  const [isMuted, setIsMuted] = useState(false); // Start unmuted
  const [isLoading, setIsLoading] = useState(true);
  const [showComments, setShowComments] = useState(false);
  const [isBuffering, setIsBuffering] = useState(false);
  const videoRef = useRef<Video>(null);
  
  // Use Firebase hooks for real-time stats
  const { stats, loading: statsLoading, toggleLike } = useVideoStats(video.id);

  // Auto-play/pause based on active state
  useEffect(() => {
    if (videoRef.current) {
      if (isActive) {
        videoRef.current.playAsync();
        setIsPlaying(true);
      } else {
        videoRef.current.pauseAsync();
        setIsPlaying(false);
      }
    }
  }, [isActive]);

  const handleLike = () => {
    if (Platform.OS !== 'web') {
      // Add haptic feedback for mobile
    }
    toggleLike();
  };

  const handleShare = async () => {
    try {
      const shareContent = {
        title: video.product.name,
        message: `Check out this amazing product: ${video.product.name} - ${video.product.price}`,
        url: video.product.productUrl,
      };

      if (Platform.OS === 'web') {
        // Web share API or fallback
        if (navigator.share && navigator.canShare && navigator.canShare(shareContent)) {
          await navigator.share(shareContent);
        } else {
          // Fallback for web browsers without share API
          const shareText = `${shareContent.message}\n\n${shareContent.url}`;
          
          if (navigator.clipboard) {
            await navigator.clipboard.writeText(shareText);
            Alert.alert(
              'Link Copied!',
              'The product link has been copied to your clipboard.',
              [{ text: 'OK', style: 'default' }]
            );
          } else {
            // Final fallback - create a temporary text area
            const textArea = document.createElement('textarea');
            textArea.value = shareText;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
            
            Alert.alert(
              'Link Copied!',
              'The product link has been copied to your clipboard.',
              [{ text: 'OK', style: 'default' }]
            );
          }
        }
      } else {
        // Mobile share functionality
        const result = await Share.share({
          title: shareContent.title,
          message: Platform.OS === 'ios' 
            ? shareContent.message 
            : `${shareContent.message}\n\n${shareContent.url}`,
          url: Platform.OS === 'ios' ? shareContent.url : undefined,
        });

        if (result.action === Share.sharedAction) {
          console.log('Content shared successfully');
        } else if (result.action === Share.dismissedAction) {
          console.log('Share dismissed');
        }
      }
    } catch (error) {
      console.error('Error sharing:', error);
      Alert.alert(
        'Share Failed',
        'Unable to share this product. Please try again.',
        [{ text: 'OK', style: 'default' }]
      );
    }
  };

  const handleComment = () => {
    setShowComments(true);
  };

  const handleProductLink = async () => {
    try {
      const supported = await Linking.canOpenURL(video.product.productUrl);
      
      if (supported) {
        await Linking.openURL(video.product.productUrl);
      } else {
        Alert.alert(
          'Unable to Open Link',
          'Cannot open the product link at this time.',
          [{ text: 'OK', style: 'default' }]
        );
      }
    } catch (error) {
      console.error('Error opening product link:', error);
      Alert.alert(
        'Link Error',
        'Unable to open the product link. Please try again.',
        [{ text: 'OK', style: 'default' }]
      );
    }
  };

  const handleVideoPress = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pauseAsync();
        setIsPlaying(false);
      } else {
        videoRef.current.playAsync();
        setIsPlaying(true);
      }
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
      console.error('Video playback error:', status.error);
      setIsLoading(false);
    }
  };

  // Use Firebase stats or fallback to original video stats
  const displayStats = statsLoading ? {
    likesCount: video.likes,
    commentsCount: video.comments,
    isLikedByUser: video.isLiked,
  } : stats;

  return (
    <View style={styles.container}>
      {/* Video Player */}
      <TouchableOpacity 
        style={styles.videoContainer} 
        onPress={handleVideoPress}
        activeOpacity={1}
      >
        <Video
          ref={videoRef}
          source={{ uri: video.videoUrl }}
          style={styles.video}
          resizeMode={ResizeMode.COVER}
          shouldPlay={isActive && isPlaying}
          isLooping={true}
          isMuted={isMuted} // Controlled by user
          volume={1.0} // Full volume
          rate={1.0} // Normal playback speed
          onPlaybackStatusUpdate={handlePlaybackStatusUpdate}
          // Performance optimizations
          useNativeControls={false}
          progressUpdateIntervalMillis={1000}
          positionMillis={0}
        />
        
        {/* Play/Pause Overlay */}
        {!isPlaying && !isLoading && (
          <View style={styles.playOverlay}>
            <View style={styles.playButton}>
              <Play size={32} color="#FFFFFF" fill="#FFFFFF" />
            </View>
          </View>
        )}

        {/* Loading/Buffering Indicator */}
        {(isLoading || isBuffering) && (
          <View style={styles.loadingOverlay}>
            <View style={styles.loadingSpinner} />
            <Text style={styles.loadingText}>
              {isLoading ? 'Loading...' : 'Buffering...'}
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
      
      {/* Product overlay - positioned with proper spacing from nav bar */}
      <LinearGradient
        colors={['transparent', 'rgba(0,0,0,0.4)', 'rgba(0,0,0,0.8)']}
        style={styles.overlay}
      >
        <View style={styles.productInfo}>
          {/* Shop Now Button */}
          <TouchableOpacity 
            style={styles.shopNowButton}
            onPress={handleProductLink}
            activeOpacity={0.7}
          >
            <ExternalLink size={18} color="#FFFFFF" />
            <Text style={styles.shopNowButtonText}>Shop Now</Text>
          </TouchableOpacity>
          
          {/* Price */}
          <Text style={styles.productPrice}>{video.product.price}</Text>
          
          {/* Product Title - Now under price */}
          <Text style={styles.productTitle} numberOfLines={2}>
            {video.product.name}
          </Text>
        </View>
      </LinearGradient>

      {/* Action buttons - positioned with proper spacing */}
      <View style={styles.actionBar}>
        <TouchableOpacity 
          style={styles.actionButton}
          onPress={handleLike}
          activeOpacity={0.8}
        >
          <Heart 
            size={28} 
            color={displayStats.isLikedByUser ? "#FF3040" : "#FFFFFF"} 
            fill={displayStats.isLikedByUser ? "#FF3040" : "transparent"}
          />
          <Text style={[styles.actionText, displayStats.isLikedByUser && styles.likedText]}>
            {displayStats.likesCount.toLocaleString()}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.actionButton}
          onPress={handleComment}
          activeOpacity={0.8}
        >
          <MessageCircle size={28} color="#FFFFFF" />
          <Text style={styles.actionText}>{displayStats.commentsCount}</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.actionButton}
          onPress={handleShare}
          activeOpacity={0.8}
        >
          <ShareIcon size={28} color="#FFFFFF" />
          <Text style={styles.actionText}>Share</Text>
        </TouchableOpacity>
      </View>

      {/* Comments Modal */}
      <CommentsModal
        visible={showComments}
        onClose={() => setShowComments(false)}
        videoId={video.id}
        productName={video.product.name}
      />
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
  videoContainer: {
    width: '100%',
    height: '100%',
    position: 'relative',
  },
  video: {
    width: '100%',
    height: '100%',
  },
  playOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  playButton: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 40,
    padding: 20,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.5)',
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
  overlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '40%',
    justifyContent: 'flex-end',
    paddingHorizontal: 20,
    paddingBottom: 120, // Increased spacing from nav bar
  },
  productInfo: {
    marginBottom: 20, // Increased spacing between elements
    maxWidth: '75%',
  },
  shopNowButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'transparent',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 25,
    alignSelf: 'flex-start',
    marginBottom: 16, // Increased spacing below button
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.8)',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.6,
    shadowRadius: 4,
    elevation: 6,
  },
  shopNowButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontFamily: 'Inter-Bold',
    marginLeft: 6,
    letterSpacing: 0.5,
    textShadowColor: 'rgba(0,0,0,0.9)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  productPrice: {
    color: '#FFFFFF',
    fontSize: 22,
    fontFamily: 'Inter-Bold',
    marginBottom: 8, // Increased spacing below price
    textShadowColor: 'rgba(0,0,0,0.8)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  productTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    lineHeight: 22,
    opacity: 0.9,
    textShadowColor: 'rgba(0,0,0,0.8)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  actionBar: {
    position: 'absolute',
    right: 16,
    bottom: 140, // Increased spacing from nav bar
    alignItems: 'center',
  },
  actionButton: {
    alignItems: 'center',
    marginBottom: 24, // Increased spacing between action buttons
    padding: 8,
  },
  actionText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontFamily: 'Inter-Medium',
    marginTop: 4,
    textAlign: 'center',
    textShadowColor: 'rgba(0,0,0,0.8)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  likedText: {
    color: '#FF3040',
  },
});