import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Dimensions,
  FlatList,
  Image,
  TouchableOpacity,
  Linking,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Search, Filter, ExternalLink } from 'lucide-react-native';
import ProductCard from '@/components/ProductCard';
import AdCard from '@/components/AdCard';

const { width } = Dimensions.get('window');

// Firebase shop slider items
const shopSliderItems = [
  {
    id: '1',
    image: 'https://admindash11.s3.amazonaws.com/shop-slider/1749856420152-Light_Blue_Modern_Laptop_Sale_Facebook_Cover.png',
    clickUrl: 'https://amzn.to/4e2OBKx',
    title: 'Laptop Sale',
    description: 'Up to 50% off on premium laptops',
  },
  // Demo additional slider items for better showcase
  {
    id: '2',
    image: 'https://images.pexels.com/photos/356056/pexels-photo-356056.jpeg?auto=compress&cs=tinysrgb&w=800',
    clickUrl: 'https://example.com/electronics',
    title: 'Electronics Deal',
    description: 'Best prices on tech gadgets',
  },
  {
    id: '3',
    image: 'https://images.pexels.com/photos/1649771/pexels-photo-1649771.jpeg?auto=compress&cs=tinysrgb&w=800',
    clickUrl: 'https://example.com/audio',
    title: 'Audio Equipment',
    description: 'Premium sound experience',
  },
];

const mockProducts = [
  {
    id: '1',
    name: 'Wireless Bluetooth Headphones',
    image: 'https://images.pexels.com/photos/1649771/pexels-photo-1649771.jpeg?auto=compress&cs=tinysrgb&w=400',
    price: '$99.99',
    category: 'Electronics',
    isLiked: false,
  },
  {
    id: '2',
    name: 'Smart Fitness Tracker',
    image: 'https://images.pexels.com/photos/5632402/pexels-photo-5632402.jpeg?auto=compress&cs=tinysrgb&w=400',
    price: '$149.99',
    category: 'Health & Fitness',
    isLiked: true,
  },
  {
    id: '3',
    name: 'Premium Coffee Maker',
    image: 'https://images.pexels.com/photos/230544/pexels-photo-230544.jpeg?auto=compress&cs=tinysrgb&w=400',
    price: '$299.99',
    category: 'Home & Kitchen',
    isLiked: false,
  },
  {
    id: '4',
    name: 'Running Shoes',
    image: 'https://images.pexels.com/photos/1598505/pexels-photo-1598505.jpeg?auto=compress&cs=tinysrgb&w=400',
    price: '$129.99',
    category: 'Fashion',
    isLiked: false,
  },
  {
    id: '5',
    name: 'Wireless Gaming Mouse',
    image: 'https://images.pexels.com/photos/2115256/pexels-photo-2115256.jpeg?auto=compress&cs=tinysrgb&w=400',
    price: '$79.99',
    category: 'Gaming',
    isLiked: false,
  },
  {
    id: '6',
    name: 'Smartphone Stand',
    image: 'https://images.pexels.com/photos/1841841/pexels-photo-1841841.jpeg?auto=compress&cs=tinysrgb&w=400',
    price: '$24.99',
    category: 'Accessories',
    isLiked: true,
  },
  {
    id: '7',
    name: 'Bluetooth Speaker',
    image: 'https://images.pexels.com/photos/1649771/pexels-photo-1649771.jpeg?auto=compress&cs=tinysrgb&w=400',
    price: '$59.99',
    category: 'Electronics',
    isLiked: false,
  },
  {
    id: '8',
    name: 'Yoga Mat',
    image: 'https://images.pexels.com/photos/4056723/pexels-photo-4056723.jpeg?auto=compress&cs=tinysrgb&w=400',
    price: '$39.99',
    category: 'Fitness',
    isLiked: false,
  },
  {
    id: '9',
    name: 'LED Desk Lamp',
    image: 'https://images.pexels.com/photos/1112598/pexels-photo-1112598.jpeg?auto=compress&cs=tinysrgb&w=400',
    price: '$89.99',
    category: 'Home & Office',
    isLiked: true,
  },
  {
    id: '10',
    name: 'Wireless Charger',
    image: 'https://images.pexels.com/photos/4219654/pexels-photo-4219654.jpeg?auto=compress&cs=tinysrgb&w=400',
    price: '$34.99',
    category: 'Electronics',
    isLiked: false,
  },
];

const mockAds = [
  {
    id: 'ad-1',
    title: 'Best Deals on Electronics',
    description: 'Up to 50% off on selected items',
    image: 'https://images.pexels.com/photos/1841841/pexels-photo-1841841.jpeg?auto=compress&cs=tinysrgb&w=512',
    sponsor: 'TechStore',
  },
  {
    id: 'ad-2',
    title: 'Premium Fashion Collection',
    description: 'New arrivals for the season',
    image: 'https://images.pexels.com/photos/996329/pexels-photo-996329.jpeg?auto=compress&cs=tinysrgb&w=512',
    sponsor: 'StyleHub',
  },
  {
    id: 'ad-3',
    title: 'Home & Garden Essentials',
    description: 'Transform your living space',
    image: 'https://images.pexels.com/photos/1080721/pexels-photo-1080721.jpeg?auto=compress&cs=tinysrgb&w=512',
    sponsor: 'HomeDecor',
  },
  {
    id: 'ad-4',
    title: 'Fitness Equipment Sale',
    description: 'Get fit with premium gear',
    image: 'https://images.pexels.com/photos/4056723/pexels-photo-4056723.jpeg?auto=compress&cs=tinysrgb&w=512',
    sponsor: 'FitGear',
  },
];

export default function ShopScreen() {
  const [currentSlider, setCurrentSlider] = useState(0);
  const scrollViewRef = useRef<ScrollView>(null);

  const handleLike = (productId: string) => {
    console.log('Product liked:', productId);
  };

  const handleSliderPress = async (item: typeof shopSliderItems[0]) => {
    try {
      const supported = await Linking.canOpenURL(item.clickUrl);
      if (supported) {
        await Linking.openURL(item.clickUrl);
      } else {
        console.log('Cannot open URL:', item.clickUrl);
      }
    } catch (error) {
      console.error('Error opening slider link:', error);
    }
  };

  // Create a mixed array of products and ads
  const createMixedContent = () => {
    const mixedContent = [];
    let adIndex = 0;

    for (let i = 0; i < mockProducts.length; i++) {
      mixedContent.push({ type: 'product', data: mockProducts[i] });
      
      // Insert ad after every 4 products (positions 4, 8, 12, etc.)
      if ((i + 1) % 4 === 0 && adIndex < mockAds.length) {
        mixedContent.push({ type: 'ad', data: mockAds[adIndex] });
        adIndex++;
      }
    }

    return mixedContent;
  };

  const mixedContent = createMixedContent();

  const renderGridItem = (item: any, index: number) => {
    const isLeftColumn = index % 2 === 0;
    
    if (item.type === 'ad') {
      // For ads, we want them to span full width occasionally
      const shouldSpanFullWidth = Math.random() > 0.7; // 30% chance for full width
      
      if (shouldSpanFullWidth) {
        return (
          <View key={`ad-${item.data.id}`} style={styles.fullWidthAdContainer}>
            <AdCard ad={item.data} style="full" />
          </View>
        );
      } else {
        return (
          <View key={`ad-${item.data.id}`} style={[styles.gridItem, isLeftColumn ? styles.leftItem : styles.rightItem]}>
            <AdCard ad={item.data} style="grid" />
          </View>
        );
      }
    } else {
      return (
        <View key={item.data.id} style={[styles.gridItem, isLeftColumn ? styles.leftItem : styles.rightItem]}>
          <ProductCard product={item.data} onLike={handleLike} />
        </View>
      );
    }
  };

  const renderSliderItem = ({ item }: { item: typeof shopSliderItems[0] }) => (
    <TouchableOpacity 
      style={styles.sliderItem}
      onPress={() => handleSliderPress(item)}
      activeOpacity={0.9}
    >
      <Image
        source={{ uri: item.image }}
        style={styles.sliderImage}
        resizeMode="cover"
      />
      <View style={styles.sliderOverlay}>
        <View style={styles.sliderContent}>
          <Text style={styles.sliderTitle}>{item.title}</Text>
          <Text style={styles.sliderDescription}>{item.description}</Text>
          <View style={styles.sliderButton}>
            <ExternalLink size={16} color="#FFFFFF" />
            <Text style={styles.sliderButtonText}>Shop Now</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Shop</Text>
          <View style={styles.headerActions}>
            <TouchableOpacity style={styles.iconButton}>
              <Search size={24} color="#1C1C1E" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconButton}>
              <Filter size={24} color="#1C1C1E" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Shop Slider Section */}
        <View style={styles.sliderSection}>
          <FlatList
            data={shopSliderItems}
            renderItem={renderSliderItem}
            keyExtractor={(item) => item.id}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onMomentumScrollEnd={(event) => {
              const index = Math.round(event.nativeEvent.contentOffset.x / width);
              setCurrentSlider(index);
            }}
            snapToInterval={width}
            snapToAlignment="start"
            decelerationRate="fast"
          />
          
          {/* Slider Indicators */}
          <View style={styles.sliderIndicators}>
            {shopSliderItems.map((_, index) => (
              <View
                key={index}
                style={[
                  styles.indicator,
                  index === currentSlider && styles.activeIndicator,
                ]}
              />
            ))}
          </View>
        </View>

        {/* Products Grid with Integrated Ads */}
        <View style={styles.productsSection}>
          <Text style={styles.sectionTitle}>Featured Products</Text>
          <View style={styles.productsGrid}>
            {mixedContent.map((item, index) => renderGridItem(item, index))}
          </View>
        </View>
      </ScrollView>
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
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
  },
  headerTitle: {
    fontSize: 28,
    fontFamily: 'Inter-Bold',
    color: '#1C1C1E',
  },
  headerActions: {
    flexDirection: 'row',
    gap: 8,
  },
  iconButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#F2F2F7',
  },
  sliderSection: {
    marginVertical: 16,
  },
  sliderItem: {
    width: width,
    height: 220,
    position: 'relative',
  },
  sliderImage: {
    width: '100%',
    height: '100%',
  },
  sliderOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '60%',
    background: 'linear-gradient(transparent, rgba(0,0,0,0.7))',
    justifyContent: 'flex-end',
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  sliderContent: {
    alignItems: 'flex-start',
  },
  sliderTitle: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
    marginBottom: 6,
    textShadowColor: 'rgba(0,0,0,0.8)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  sliderDescription: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#FFFFFF',
    opacity: 0.9,
    marginBottom: 16,
    textShadowColor: 'rgba(0,0,0,0.8)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  sliderButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
    gap: 8,
  },
  sliderButtonText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
    textShadowColor: 'rgba(0,0,0,0.8)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  sliderIndicators: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 12,
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
    width: 24,
  },
  productsSection: {
    paddingHorizontal: 16,
    paddingBottom: 100,
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: '#1C1C1E',
    marginBottom: 16,
  },
  productsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  gridItem: {
    width: (width - 48) / 2,
    marginBottom: 16,
  },
  leftItem: {
    marginRight: 8,
  },
  rightItem: {
    marginLeft: 8,
  },
  fullWidthAdContainer: {
    width: '100%',
    marginBottom: 16,
  },
});