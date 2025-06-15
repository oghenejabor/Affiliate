import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Image,
  TouchableOpacity,
  Dimensions,
  Share,
  Linking,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import { 
  ArrowLeft, 
  Heart, 
  Share2, 
  ExternalLink,
  Star,
  Truck,
  Shield,
  RotateCcw
} from 'lucide-react-native';
import AdCard from '@/components/AdCard';

const { width } = Dimensions.get('window');

const mockProduct = {
  id: '1',
  name: 'Premium Wireless Bluetooth Headphones',
  images: [
    'https://images.pexels.com/photos/1649771/pexels-photo-1649771.jpeg?auto=compress&cs=tinysrgb&w=800',
    'https://images.pexels.com/photos/3945667/pexels-photo-3945667.jpeg?auto=compress&cs=tinysrgb&w=800',
    'https://images.pexels.com/photos/8534088/pexels-photo-8534088.jpeg?auto=compress&cs=tinysrgb&w=800',
  ],
  price: '$99.99',
  originalPrice: '$149.99',
  discount: '33% OFF',
  rating: 4.8,
  reviewCount: 2847,
  category: 'Electronics',
  brand: 'AudioTech',
  description: 'Experience premium sound quality with these wireless Bluetooth headphones. Featuring active noise cancellation, 30-hour battery life, and premium comfort padding for all-day wear.',
  features: [
    'Active Noise Cancellation',
    '30-hour battery life',
    'Premium comfort padding',
    'Bluetooth 5.0 connectivity',
    'Quick charge: 5 min = 2 hours playback',
    'Foldable design for portability'
  ],
  specifications: {
    'Driver Size': '40mm',
    'Frequency Response': '20Hz - 20kHz',
    'Impedance': '32 Ohm',
    'Weight': '250g',
    'Connectivity': 'Bluetooth 5.0, 3.5mm jack',
    'Battery': '30 hours wireless, 40 hours wired'
  },
  affiliateLink: 'https://example.com/affiliate-link',
  isLiked: false,
};

const mockAds = [
  {
    id: 'ad-1',
    title: 'Audio Accessories Sale',
    description: 'Complete your setup with premium cables and stands',
    image: 'https://images.pexels.com/photos/1649771/pexels-photo-1649771.jpeg?auto=compress&cs=tinysrgb&w=400',
    sponsor: 'AudioHub',
  },
  {
    id: 'ad-2',
    title: 'Tech Protection Plans',
    description: 'Protect your investment with extended warranty',
    image: 'https://images.pexels.com/photos/356056/pexels-photo-356056.jpeg?auto=compress&cs=tinysrgb&w=400',
    sponsor: 'TechGuard',
  },
];

export default function ProductDetailsScreen() {
  const { id } = useLocalSearchParams();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isLiked, setIsLiked] = useState(mockProduct.isLiked);
  const scrollViewRef = useRef<ScrollView>(null);

  const handleBack = () => {
    router.back();
  };

  const handleLike = () => {
    setIsLiked(!isLiked);
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Check out this amazing product: ${mockProduct.name} - ${mockProduct.price}`,
        url: mockProduct.affiliateLink,
      });
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  const handleBuyNow = () => {
    Linking.openURL(mockProduct.affiliateLink);
  };

  const handleImageScroll = (event: any) => {
    const contentOffset = event.nativeEvent.contentOffset.x;
    const index = Math.round(contentOffset / width);
    setCurrentImageIndex(index);
  };

  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <Star key={i} size={16} color="#FFD700" fill="#FFD700" />
      );
    }

    if (hasHalfStar) {
      stars.push(
        <Star key="half" size={16} color="#FFD700" fill="#FFD700" />
      );
    }

    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <Star key={`empty-${i}`} size={16} color="#E5E5EA" />
      );
    }

    return stars;
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.headerButton} onPress={handleBack}>
            <ArrowLeft size={24} color="#1C1C1E" />
          </TouchableOpacity>
          <View style={styles.headerActions}>
            <TouchableOpacity style={styles.headerButton} onPress={handleLike}>
              <Heart 
                size={24} 
                color={isLiked ? "#FF3040" : "#1C1C1E"} 
                fill={isLiked ? "#FF3040" : "transparent"}
              />
            </TouchableOpacity>
            <TouchableOpacity style={styles.headerButton} onPress={handleShare}>
              <Share2 size={24} color="#1C1C1E" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Image Carousel */}
        <View style={styles.imageSection}>
          <ScrollView
            ref={scrollViewRef}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onMomentumScrollEnd={handleImageScroll}
          >
            {mockProduct.images.map((image, index) => (
              <Image
                key={index}
                source={{ uri: image }}
                style={styles.productImage}
                resizeMode="cover"
              />
            ))}
          </ScrollView>
          
          <View style={styles.imageIndicators}>
            {mockProduct.images.map((_, index) => (
              <View
                key={index}
                style={[
                  styles.indicator,
                  index === currentImageIndex && styles.activeIndicator,
                ]}
              />
            ))}
          </View>

          {mockProduct.discount && (
            <View style={styles.discountBadge}>
              <Text style={styles.discountText}>{mockProduct.discount}</Text>
            </View>
          )}
        </View>

        {/* Product Info */}
        <View style={styles.productInfo}>
          <View style={styles.brandRow}>
            <Text style={styles.brand}>{mockProduct.brand}</Text>
            <Text style={styles.category}>{mockProduct.category}</Text>
          </View>
          
          <Text style={styles.productName}>{mockProduct.name}</Text>
          
          <View style={styles.ratingRow}>
            <View style={styles.stars}>
              {renderStars(mockProduct.rating)}
            </View>
            <Text style={styles.rating}>{mockProduct.rating}</Text>
            <Text style={styles.reviewCount}>({mockProduct.reviewCount} reviews)</Text>
          </View>

          <View style={styles.priceRow}>
            <Text style={styles.price}>{mockProduct.price}</Text>
            {mockProduct.originalPrice && (
              <Text style={styles.originalPrice}>{mockProduct.originalPrice}</Text>
            )}
          </View>
        </View>

        {/* Features */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Key Features</Text>
          <View style={styles.featuresContainer}>
            {mockProduct.features.map((feature, index) => (
              <View key={index} style={styles.featureItem}>
                <View style={styles.featureBullet} />
                <Text style={styles.featureText}>{feature}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Description */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Description</Text>
          <Text style={styles.description}>{mockProduct.description}</Text>
        </View>

        {/* Specifications */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Specifications</Text>
          <View style={styles.specificationsContainer}>
            {Object.entries(mockProduct.specifications).map(([key, value], index) => (
              <View key={index} style={styles.specificationRow}>
                <Text style={styles.specificationKey}>{key}</Text>
                <Text style={styles.specificationValue}>{value}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Trust Indicators */}
        <View style={styles.section}>
          <View style={styles.trustIndicators}>
            <View style={styles.trustItem}>
              <Truck size={20} color="#34C759" />
              <Text style={styles.trustText}>Free Shipping</Text>
            </View>
            <View style={styles.trustItem}>
              <Shield size={20} color="#007AFF" />
              <Text style={styles.trustText}>2 Year Warranty</Text>
            </View>
            <View style={styles.trustItem}>
              <RotateCcw size={20} color="#FF9500" />
              <Text style={styles.trustText}>30-Day Returns</Text>
            </View>
          </View>
        </View>

        {/* Native Ads */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>You might also like</Text>
          <View style={styles.adsContainer}>
            {mockAds.map((ad) => (
              <AdCard key={ad.id} ad={ad} style="grid" />
            ))}
          </View>
        </View>

        <View style={styles.bottomSpacer} />
      </ScrollView>

      {/* Fixed Bottom Bar */}
      <View style={styles.bottomBar}>
        <TouchableOpacity style={styles.buyNowButton} onPress={handleBuyNow}>
          <ExternalLink size={20} color="#FFFFFF" />
          <Text style={styles.buyNowText}>Buy Now</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F7',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
  },
  headerButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#F2F2F7',
  },
  headerActions: {
    flexDirection: 'row',
    gap: 8,
  },
  imageSection: {
    position: 'relative',
    backgroundColor: '#FFFFFF',
  },
  productImage: {
    width: width,
    height: width,
  },
  imageIndicators: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingVertical: 16,
    gap: 6,
  },
  indicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#C7C7CC',
  },
  activeIndicator: {
    backgroundColor: '#007AFF',
  },
  discountBadge: {
    position: 'absolute',
    top: 16,
    left: 16,
    backgroundColor: '#FF3040',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  discountText: {
    fontSize: 12,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
  },
  productInfo: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    marginBottom: 16,
  },
  brandRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  brand: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#007AFF',
  },
  category: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#8E8E93',
  },
  productName: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#1C1C1E',
    marginBottom: 12,
    lineHeight: 30,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  stars: {
    flexDirection: 'row',
    marginRight: 8,
  },
  rating: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#1C1C1E',
    marginRight: 4,
  },
  reviewCount: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#8E8E93',
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  price: {
    fontSize: 28,
    fontFamily: 'Inter-Bold',
    color: '#007AFF',
  },
  originalPrice: {
    fontSize: 18,
    fontFamily: 'Inter-Regular',
    color: '#8E8E93',
    textDecorationLine: 'line-through',
  },
  section: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: '#1C1C1E',
    marginBottom: 16,
  },
  featuresContainer: {
    gap: 12,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  featureBullet: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#007AFF',
    marginRight: 12,
  },
  featureText: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#1C1C1E',
    flex: 1,
  },
  description: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#1C1C1E',
    lineHeight: 24,
  },
  specificationsContainer: {
    gap: 12,
  },
  specificationRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F2F2F7',
  },
  specificationKey: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#1C1C1E',
    flex: 1,
  },
  specificationValue: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#8E8E93',
    textAlign: 'right',
    flex: 1,
  },
  trustIndicators: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  trustItem: {
    alignItems: 'center',
    gap: 8,
  },
  trustText: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#1C1C1E',
    textAlign: 'center',
  },
  adsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  bottomSpacer: {
    height: 100,
  },
  bottomBar: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#E5E5EA',
  },
  buyNowButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#007AFF',
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
  },
  buyNowText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
  },
});