import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { 
  Smartphone, 
  Shirt, 
  Home, 
  Dumbbell, 
  Book, 
  Car,
  Gamepad2,
  Coffee
} from 'lucide-react-native';

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - 48) / 2;

interface CategoryCardProps {
  category: {
    id: string;
    name: string;
    icon: string;
    color: string;
    productCount: number;
  };
  onPress: (categoryId: string) => void;
}

const iconMap = {
  electronics: Smartphone,
  fashion: Shirt,
  home: Home,
  sports: Dumbbell,
  books: Book,
  automotive: Car,
  gaming: Gamepad2,
  food: Coffee,
};

export default function CategoryCard({ category, onPress }: CategoryCardProps) {
  const IconComponent = iconMap[category.icon as keyof typeof iconMap] || Smartphone;

  const handlePress = () => {
    onPress(category.id);
  };

  return (
    <TouchableOpacity 
      style={[styles.container, { backgroundColor: category.color }]}
      onPress={handlePress}
      activeOpacity={0.8}
    >
      <View style={styles.iconContainer}>
        <IconComponent size={32} color="#FFFFFF" />
      </View>
      
      <View style={styles.content}>
        <Text style={styles.categoryName}>{category.name}</Text>
        <Text style={styles.productCount}>
          {category.productCount} products
        </Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    width: CARD_WIDTH,
    height: 120,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  iconContainer: {
    alignSelf: 'flex-start',
  },
  content: {
    alignSelf: 'flex-start',
  },
  categoryName: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  productCount: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: 'rgba(255,255,255,0.8)',
  },
});