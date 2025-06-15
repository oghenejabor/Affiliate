import { useState, useEffect } from 'react';
import { ref, onValue, off, push, set, remove, get } from 'firebase/database';
import { database } from '@/config/firebase';
import { UserLike, UserComment, CommentReply, VideoStats, CommentWithReplies } from '@/types';

// Mock user for demo purposes - in a real app, this would come from authentication
const MOCK_USER = {
  id: 'user_demo_123',
  name: 'Demo User',
  email: 'demo@example.com',
  avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=100',
};

export function useVideoStats(videoId: string) {
  const [stats, setStats] = useState<VideoStats>({
    likesCount: 0,
    commentsCount: 0,
    isLikedByUser: false,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const likesRef = ref(database, `interactions/likes/${videoId}`);
    const commentsRef = ref(database, `interactions/comments/${videoId}`);

    const likesUnsubscribe = onValue(likesRef, (snapshot) => {
      const likesData = snapshot.val();
      const likesCount = likesData ? Object.keys(likesData).length : 0;
      const isLikedByUser = likesData ? !!likesData[MOCK_USER.id] : false;

      setStats(prev => ({
        ...prev,
        likesCount,
        isLikedByUser,
      }));
    });

    const commentsUnsubscribe = onValue(commentsRef, (snapshot) => {
      const commentsData = snapshot.val();
      let commentsCount = 0;

      if (commentsData) {
        // Count comments and their replies
        Object.values(commentsData).forEach((comment: any) => {
          commentsCount++; // Count the comment itself
          if (comment.replies) {
            commentsCount += Object.keys(comment.replies).length; // Count replies
          }
        });
      }

      setStats(prev => ({
        ...prev,
        commentsCount,
      }));
      setLoading(false);
    });

    return () => {
      off(likesRef, 'value', likesUnsubscribe);
      off(commentsRef, 'value', commentsUnsubscribe);
    };
  }, [videoId]);

  const toggleLike = async () => {
    try {
      const likeRef = ref(database, `interactions/likes/${videoId}/${MOCK_USER.id}`);
      
      if (stats.isLikedByUser) {
        // Remove like
        await remove(likeRef);
      } else {
        // Add like
        const likeData: UserLike = {
          userId: MOCK_USER.id,
          videoId,
          likedAt: Date.now(),
          userName: MOCK_USER.name,
          userAvatar: MOCK_USER.avatar,
        };
        await set(likeRef, likeData);
      }
    } catch (error) {
      console.error('Error toggling like:', error);
    }
  };

  return { stats, loading, toggleLike };
}

export function useVideoComments(videoId: string) {
  const [comments, setComments] = useState<CommentWithReplies[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const commentsRef = ref(database, `interactions/comments/${videoId}`);

    const unsubscribe = onValue(commentsRef, (snapshot) => {
      const data = snapshot.val();
      
      if (data) {
        const commentsArray: CommentWithReplies[] = Object.entries(data).map(([commentId, commentData]) => {
          const comment = commentData as UserComment;
          const repliesArray = comment.replies 
            ? Object.entries(comment.replies).map(([replyId, replyData]) => ({
                ...replyData as CommentReply,
                replyId,
              })).sort((a, b) => a.createdAt - b.createdAt)
            : [];

          return {
            ...comment,
            commentId,
            repliesArray,
          };
        }).sort((a, b) => b.createdAt - a.createdAt); // Newest comments first

        setComments(commentsArray);
      } else {
        setComments([]);
      }
      setLoading(false);
    });

    return () => {
      off(commentsRef, 'value', unsubscribe);
    };
  }, [videoId]);

  const addComment = async (text: string) => {
    try {
      const commentsRef = ref(database, `interactions/comments/${videoId}`);
      const newCommentRef = push(commentsRef);
      
      const commentData: UserComment = {
        commentId: newCommentRef.key!,
        userId: MOCK_USER.id,
        videoId,
        text: text.trim(),
        createdAt: Date.now(),
        userName: MOCK_USER.name,
        userAvatar: MOCK_USER.avatar,
        likes: 0,
      };

      await set(newCommentRef, commentData);
      return true;
    } catch (error) {
      console.error('Error adding comment:', error);
      return false;
    }
  };

  const addReply = async (commentId: string, text: string, replyingTo?: string) => {
    try {
      const repliesRef = ref(database, `interactions/comments/${videoId}/${commentId}/replies`);
      const newReplyRef = push(repliesRef);
      
      const replyData: CommentReply = {
        replyId: newReplyRef.key!,
        userId: MOCK_USER.id,
        commentId,
        text: text.trim(),
        createdAt: Date.now(),
        userName: MOCK_USER.name,
        userAvatar: MOCK_USER.avatar,
        likes: 0,
        replyingTo,
      };

      await set(newReplyRef, replyData);
      return true;
    } catch (error) {
      console.error('Error adding reply:', error);
      return false;
    }
  };

  const likeComment = async (commentId: string, isReply: boolean = false, replyId?: string) => {
    try {
      const likePath = isReply 
        ? `interactions/comments/${videoId}/${commentId}/replies/${replyId}/likes`
        : `interactions/comments/${videoId}/${commentId}/likes`;
      
      const likesRef = ref(database, likePath);
      const userLikeRef = ref(database, `${likePath}/${MOCK_USER.id}`);
      
      // Check if user already liked
      const snapshot = await get(userLikeRef);
      
      if (snapshot.exists()) {
        // Remove like
        await remove(userLikeRef);
      } else {
        // Add like
        await set(userLikeRef, {
          userId: MOCK_USER.id,
          likedAt: Date.now(),
        });
      }
    } catch (error) {
      console.error('Error liking comment:', error);
    }
  };

  return { 
    comments, 
    loading, 
    addComment, 
    addReply, 
    likeComment 
  };
}