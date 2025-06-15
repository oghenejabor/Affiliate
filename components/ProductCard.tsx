import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { Heart, ExternalLink } from 'lucide-react-native';
import { router } from 'expo-router';

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - 48) / 2;

interface ProductCardProps {
  product: {
    id: string;
    name: string;
    image: string;
    price?: string;
    category: string;
    isLiked: boolean;
  };
  onLike?: (productId: string) => void;
}

export default function ProductCard({ product, onLike }: ProductCardProps) {
  const [isLiked, setIsLiked] = useState(product.isLiked);

  const handleLike = () => {
    setIsLiked(!isLiked);
    onLike?.(product.id);
  };

  const handlePress = () => {
    router.push(`/product/${product.id}`);
  };

  return (
    <TouchableOpacity 
      style={styles.container}
      onPress={handlePress}
      activeOpacity={0.9}
    >
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: product.image }}
          style={styles.image}
          resizeMode="cover"
        />
        <TouchableOpacity 
          style={styles.likeButton}
          onPress={handleLike}
          activeOpacity={0.8}
        >
          <Heart 
            size={20} 
            color={isLiked ? "#FF3040" : "#8E8E93"} 
            fill={isLiked ? "#FF3040" : "transparent"}
          />
        </TouchableOpacity>
      </View>
      
      <View style={styles.content}>
        <Text style={styles.productName} numberOfLines={2}>
          {product.name}
        </Text>
        <Text style={styles.category}>{product.category}</Text>
        {product.price && (
          <View style={styles.priceRow}>
            <Text style={styles.price}>{product.price}</Text>
            <ExternalLink size={14} color="#007AFF" />
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    width: CARD_WIDTH,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  imageContainer: {
    position: 'relative',
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: CARD_WIDTH * 1.2,
  },
  likeButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderRadius: 16,
    padding: 6,
  },
  content: {
    padding: 12,
  },
  productName: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#1C1C1E',
    marginBottom: 4,
    lineHeight: 18,
  },
  category: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#8E8E93',
    marginBottom: 8,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  price: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    color: '#007AFF',
  },
});