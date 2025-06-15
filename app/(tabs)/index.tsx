import React, { useState, useRef } from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  Dimensions,
  Text,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import VideoFeedItem from '@/components/VideoFeedItem';
import AdFeedItem from '@/components/AdFeedItem';
import { useFirebaseVideos } from '@/hooks/useFirebaseVideos';
import { FeedItem } from '@/types';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

export default function FeedScreen() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);
  const { feedItems, loading, error } = useFirebaseVideos();

  const onViewableItemsChanged = useRef(({ viewableItems }: any) => {
    if (viewableItems.length > 0) {
      setCurrentIndex(viewableItems[0].index);
    }
  }).current;

  const viewabilityConfig = {
    itemVisiblePercentThreshold: 50,
  };

  const renderItem = ({ item, index }: { item: FeedItem; index: number }) => {
    if (item.type === 'ad') {
      return (
        <AdFeedItem 
          ad={item} 
          isActive={index === currentIndex}
        />
      );
    } else {
      return (
        <VideoFeedItem 
          video={item} 
          isActive={index === currentIndex}
        />
      );
    }
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#FFFFFF" />
        <Text style={styles.loadingText}>Loading content...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>⚠️ {error}</Text>
        <Text style={styles.errorSubtext}>Please check your connection and try again</Text>
      </View>
    );
  }

  if (feedItems.length === 0) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.emptyText}>📱 No content available</Text>
        <Text style={styles.emptySubtext}>Check back later for new videos and ads</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        ref={flatListRef}
        data={feedItems}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        pagingEnabled
        showsVerticalScrollIndicator={false}
        snapToInterval={SCREEN_HEIGHT}
        snapToAlignment="start"
        decelerationRate="fast"
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewabilityConfig}
        getItemLayout={(data, index) => ({
          length: SCREEN_HEIGHT,
          offset: SCREEN_HEIGHT * index,
          index,
        })}
        removeClippedSubviews={true}
        maxToRenderPerBatch={2}
        windowSize={3}
        initialNumToRender={1}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  centerContainer: {
    flex: 1,
    backgroundColor: '#000000',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  loadingText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    marginTop: 16,
  },
  errorText: {
    color: '#FF3040',
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    textAlign: 'center',
    marginBottom: 8,
  },
  errorSubtext: {
    color: '#8E8E93',
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    textAlign: 'center',
  },
  emptyText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    textAlign: 'center',
    marginBottom: 8,
  },
  emptySubtext: {
    color: '#8E8E93',
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    textAlign: 'center',
  },
});