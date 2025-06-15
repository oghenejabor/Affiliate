// Firebase Video Product Types based on the uploaded JSON structure
export interface VideoProduct {
  productId: string;
  title: string;
  description: string;
  price: string;
  currency: string;
  productUrl: string;
  videoUrl: string;
  thumbnailUrl: string;
  createdAt: number;
  updatedAt: number;
  images?: {
    [key: string]: {
      imageId: string;
      imageUrl: string;
      caption: string;
      isPrimary: boolean;
      uploadedAt: number;
    };
  };
}

// Firebase Advertisement Types
export interface FirebaseAd {
  adId: string;
  adType: 'video' | 'image';
  analytics: {
    clicks: number;
    conversionRate: number;
    conversions: number;
    ctr: number;
    impressions: number;
  };
  callToAction: string;
  createdAt: number;
  destinationUrl: string;
  isActive: boolean;
  mediaUrl: string;
  title: string;
  updatedAt: number;
}

// Transformed video data for the feed
export interface VideoFeedItem {
  id: string;
  videoUrl: string;
  thumbnailUrl: string;
  product: {
    name: string;
    price: string;
    category: string;
    productUrl: string;
  };
  likes: number;
  comments: number;
  isLiked: boolean;
  type: 'video';
}

// Ad feed item for the video feed - ONLY VIDEO ADS
export interface AdFeedItem {
  id: string;
  type: 'ad';
  adType: 'video'; // Only video ads now
  mediaUrl: string;
  title: string;
  callToAction: string;
  destinationUrl: string;
}

// Combined feed item type
export type FeedItem = VideoFeedItem | AdFeedItem;

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  preferences?: {
    darkMode: boolean;
    notifications: boolean;
  };
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: string;
  originalPrice?: string;
  discount?: string;
  images: string[];
  category: string;
  brand?: string;
  rating?: number;
  reviewCount?: number;
  features?: string[];
  specifications?: Record<string, string>;
  affiliateLink: string;
  isLiked: boolean;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  color: string;
  productCount: number;
}

export interface Ad {
  id: string;
  title: string;
  description: string;
  image: string;
  sponsor: string;
  targetUrl?: string;
}

// Firebase User Interactions
export interface UserLike {
  userId: string;
  videoId: string;
  likedAt: number;
  userName?: string;
  userAvatar?: string;
}

export interface UserComment {
  commentId: string;
  userId: string;
  videoId: string;
  text: string;
  createdAt: number;
  updatedAt?: number;
  userName: string;
  userAvatar?: string;
  likes: number;
  replies?: {
    [replyId: string]: CommentReply;
  };
}

export interface CommentReply {
  replyId: string;
  userId: string;
  commentId: string;
  text: string;
  createdAt: number;
  updatedAt?: number;
  userName: string;
  userAvatar?: string;
  likes: number;
  replyingTo?: string; // Username being replied to
}

// Firebase Database Structure
export interface FirebaseVideoInteractions {
  likes: {
    [videoId: string]: {
      [userId: string]: UserLike;
    };
  };
  comments: {
    [videoId: string]: {
      [commentId: string]: UserComment;
    };
  };
  users: {
    [userId: string]: User;
  };
}

// Local state types for components
export interface VideoStats {
  likesCount: number;
  commentsCount: number;
  isLikedByUser: boolean;
}

export interface CommentWithReplies extends UserComment {
  repliesArray?: CommentReply[];
}