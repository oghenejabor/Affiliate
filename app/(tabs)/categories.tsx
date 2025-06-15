import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Search, Filter, SlidersHorizontal } from 'lucide-react-native';
import CategoryCard from '@/components/CategoryCard';
import ProductCard from '@/components/ProductCard';
import AdCard from '@/components/AdCard';

const mockCategories = [
  {
    id: '1',
    name: 'Electronics',
    icon: 'electronics',
    color: '#007AFF',
    productCount: 1234,
  },
  {
    id: '2',
    name: 'Fashion',
    icon: 'fashion',
    color: '#FF3B30',
    productCount: 856,
  },
  {
    id: '3',
    name: 'Home & Garden',
    icon: 'home',
    color: '#34C759',
    productCount: 642,
  },
  {
    id: '4',
    name: 'Sports & Fitness',
    icon: 'sports',
    color: '#FF9500',
    productCount: 423,
  },
  {
    id: '5',
    name: 'Books & Media',
    icon: 'books',
    color: '#5856D6',
    productCount: 789,
  },
  {
    id: '6',
    name: 'Automotive',
    icon: 'automotive',
    color: '#8E8E93',
    productCount: 234,
  },
  {
    id: '7',
    name: 'Gaming',
    icon: 'gaming',
    color: '#AF52DE',
    productCount: 567,
  },
  {
    id: '8',
    name: 'Food & Beverage',
    icon: 'food',
    color: '#FF6B35',
    productCount: 345,
  },
];

const mockCategoryProducts = [
  {
    id: '1',
    name: 'Wireless Gaming Headset',
    image: 'https://images.pexels.com/photos/3945667/pexels-photo-3945667.jpeg?auto=compress&cs=tinysrgb&w=400',
    price: '$89.99',
    category: 'Electronics',
    isLiked: false,
  },
  {
    id: '2',
    name: 'Smart Watch Pro',
    image: 'https://images.pexels.com/photos/1661469/pexels-photo-1661469.jpeg?auto=compress&cs=tinysrgb&w=400',
    price: '$299.99',
    category: 'Electronics',
    isLiked: true,
  },
  {
    id: '3',
    name: 'Bluetooth Speaker',
    image: 'https://images.pexels.com/photos/1649771/pexels-photo-1649771.jpeg?auto=compress&cs=tinysrgb&w=400',
    price: '$59.99',
    category: 'Electronics',
    isLiked: false,
  },
  {
    id: '4',
    name: 'Wireless Earbuds',
    image: 'https://images.pexels.com/photos/8534088/pexels-photo-8534088.jpeg?auto=compress&cs=tinysrgb&w=400',
    price: '$129.99',
    category: 'Electronics',
    isLiked: false,
  },
];

const mockAds = [
  {
    id: 'ad-1',
    title: 'Tech Sale Event',
    description: 'Up to 60% off electronics',
    image: 'https://images.pexels.com/photos/356056/pexels-photo-356056.jpeg?auto=compress&cs=tinysrgb&w=400',
    sponsor: 'ElectroHub',
  },
  {
    id: 'ad-2',
    title: 'Gaming Gear Special',
    description: 'Best deals on gaming accessories',
    image: 'https://images.pexels.com/photos/442576/pexels-photo-442576.jpeg?auto=compress&cs=tinysrgb&w=400',
    sponsor: 'GameZone',
  },
];

export default function CategoriesScreen() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState('newest');

  const handleCategoryPress = (categoryId: string) => {
    setSelectedCategory(categoryId);
  };

  const handleBackToCategories = () => {
    setSelectedCategory(null);
  };

  const handleLike = (productId: string) => {
    console.log('Product liked:', productId);
  };

  const renderCategoryProducts = () => {
    const selectedCategoryData = mockCategories.find(cat => cat.id === selectedCategory);
    
    const renderGridItem = (item: any, index: number) => {
      // Insert ad after every 4 products
      if (index > 0 && index % 4 === 0) {
        const adIndex = Math.floor(index / 4) - 1;
        const ad = mockAds[adIndex % mockAds.length];
        return (
          <View key={`ad-${adIndex}`} style={styles.gridContainer}>
            <AdCard ad={ad} style="grid" />
            <ProductCard product={item} onLike={handleLike} />
          </View>
        );
      }

      return (
        <ProductCard 
          key={item.id} 
          product={item} 
          onLike={handleLike} 
        />
      );
    };

    return (
      <View style={styles.categoryProductsContainer}>
        {/* Header */}
        <View style={styles.categoryHeader}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={handleBackToCategories}
          >
            <Text style={styles.backButtonText}>← Categories</Text>
          </TouchableOpacity>
          <Text style={styles.categoryTitle}>{selectedCategoryData?.name}</Text>
          <View style={styles.headerActions}>
            <TouchableOpacity style={styles.iconButton}>
              <Search size={20} color="#1C1C1E" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconButton}>
              <SlidersHorizontal size={20} color="#1C1C1E" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Sort Bar */}
        <View style={styles.sortBar}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {['newest', 'price-low', 'price-high', 'popular'].map((sort) => (
              <TouchableOpacity
                key={sort}
                style={[
                  styles.sortButton,
                  sortBy === sort && styles.activeSortButton
                ]}
                onPress={() => setSortBy(sort)}
              >
                <Text style={[
                  styles.sortButtonText,
                  sortBy === sort && styles.activeSortButtonText
                ]}>
                  {sort === 'newest' && 'Newest'}
                  {sort === 'price-low' && 'Price: Low to High'}
                  {sort === 'price-high' && 'Price: High to Low'}
                  {sort === 'popular' && 'Most Popular'}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Products Grid */}
        <ScrollView style={styles.productsContainer} showsVerticalScrollIndicator={false}>
          <View style={styles.productsGrid}>
            {mockCategoryProducts.map((product, index) => renderGridItem(product, index))}
          </View>
        </ScrollView>
      </View>
    );
  };

  if (selectedCategory) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        {renderCategoryProducts()}
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Categories</Text>
          <View style={styles.headerActions}>
            <TouchableOpacity style={styles.iconButton}>
              <Search size={24} color="#1C1C1E" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconButton}>
              <Filter size={24} color="#1C1C1E" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Categories Grid */}
        <View style={styles.categoriesSection}>
          <Text style={styles.sectionTitle}>Shop by Category</Text>
          <View style={styles.categoriesGrid}>
            {mockCategories.map((category, index) => {
              // Insert ad after every 4 categories
              if (index > 0 && index % 4 === 0) {
                const adIndex = Math.floor(index / 4) - 1;
                const ad = mockAds[adIndex % mockAds.length];
                return (
                  <View key={`category-${index}`} style={styles.categoryRow}>
                    <AdCard ad={ad} style="grid" />
                    <CategoryCard 
                      category={category} 
                      onPress={handleCategoryPress} 
                    />
                  </View>
                );
              }

              return (
                <CategoryCard 
                  key={category.id} 
                  category={category} 
                  onPress={handleCategoryPress} 
                />
              );
            })}
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
  categoriesSection: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    paddingBottom: 100,
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: '#1C1C1E',
    marginBottom: 16,
  },
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  categoryRow: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  categoryProductsContainer: {
    flex: 1,
  },
  categoryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
  },
  backButton: {
    padding: 8,
  },
  backButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#007AFF',
  },
  categoryTitle: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#1C1C1E',
    flex: 1,
    textAlign: 'center',
    marginHorizontal: 16,
  },
  sortBar: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
  },
  sortButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#F2F2F7',
    marginRight: 8,
  },
  activeSortButton: {
    backgroundColor: '#007AFF',
  },
  sortButtonText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#1C1C1E',
  },
  activeSortButtonText: {
    color: '#FFFFFF',
  },
  productsContainer: {
    flex: 1,
    backgroundColor: '#F2F2F7',
  },
  productsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 100,
  },
  gridContainer: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
});