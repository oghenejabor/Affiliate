import React from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { ExternalLink } from 'lucide-react-native';

const { width } = Dimensions.get('window');

interface AdCardProps {
  ad: {
    id: string;
    title: string;
    description: string;
    image: string;
    sponsor: string;
  };
  style?: 'grid' | 'full';
}

export default function AdCard({ ad, style = 'grid' }: AdCardProps) {
  const isGrid = style === 'grid';
  const cardWidth = isGrid ? (width - 48) / 2 : width - 32;

  const handlePress = () => {
    console.log('Ad clicked:', ad.id);
    // Here you would typically open the ad's destination URL
  };

  return (
    <TouchableOpacity 
      style={[
        styles.container,
        { width: cardWidth },
        !isGrid && styles.fullWidth
      ]}
      onPress={handlePress}
      activeOpacity={0.9}
    >
      <View style={styles.adBadge}>
        <Text style={styles.adBadgeText}>Ad</Text>
      </View>
      
      <Image
        source={{ uri: ad.image }}
        style={[
          styles.image,
          { 
            height: isGrid ? cardWidth * 0.75 : 140,
            width: cardWidth 
          }
        ]}
        resizeMode="cover"
      />
      
      <View style={[styles.content, !isGrid && styles.fullWidthContent]}>
        <View style={styles.textContent}>
          <Text style={[styles.title, !isGrid && styles.fullWidthTitle]} numberOfLines={isGrid ? 2 : 1}>
            {ad.title}
          </Text>
          <Text style={[styles.description, !isGrid && styles.fullWidthDescription]} numberOfLines={isGrid ? 2 : 1}>
            {ad.description}
          </Text>
          <Text style={styles.sponsor}>Sponsored by {ad.sponsor}</Text>
        </View>
        
        <View style={styles.actionContainer}>
          <View style={styles.ctaButton}>
            <ExternalLink size={14} color="#007AFF" />
            <Text style={styles.ctaText}>Learn More</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E5E5EA',
    position: 'relative',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  fullWidth: {
    flexDirection: 'row',
  },
  adBadge: {
    position: 'absolute',
    top: 12,
    left: 12,
    backgroundColor: '#FF9500',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    zIndex: 1,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  adBadgeText: {
    fontSize: 10,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  image: {
    width: '100%',
  },
  content: {
    padding: 16,
    flex: 1,
    justifyContent: 'space-between',
  },
  fullWidthContent: {
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  textContent: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    color: '#1C1C1E',
    marginBottom: 6,
    lineHeight: 20,
  },
  fullWidthTitle: {
    fontSize: 18,
    marginBottom: 4,
  },
  description: {
    fontSize: 13,
    fontFamily: 'Inter-Regular',
    color: '#8E8E93',
    marginBottom: 12,
    lineHeight: 18,
  },
  fullWidthDescription: {
    fontSize: 14,
    marginBottom: 8,
  },
  sponsor: {
    fontSize: 11,
    fontFamily: 'Inter-Medium',
    color: '#007AFF',
    marginBottom: 12,
  },
  actionContainer: {
    alignItems: 'flex-start',
  },
  ctaButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F2F2F7',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E5E5EA',
  },
  ctaText: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
    color: '#007AFF',
    marginLeft: 4,
  },
});