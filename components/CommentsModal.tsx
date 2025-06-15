import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  Modal,
  ScrollView,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Image,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { X, Send, Heart, MessageCircle, MoveHorizontal as MoreHorizontal } from 'lucide-react-native';
import { useVideoComments } from '@/hooks/useFirebaseInteractions';
import { CommentWithReplies } from '@/types';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

interface CommentsModalProps {
  visible: boolean;
  onClose: () => void;
  videoId: string;
  productName: string;
}

interface CommentItemProps {
  comment: CommentWithReplies;
  onReply: (commentId: string, userName: string) => void;
  onLike: (commentId: string, isReply?: boolean, replyId?: string) => void;
}

function CommentItem({ comment, onReply, onLike }: CommentItemProps) {
  const [showReplies, setShowReplies] = useState(false);

  const formatTimeAgo = (timestamp: number) => {
    const now = Date.now();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (days > 0) return `${days}d`;
    if (hours > 0) return `${hours}h`;
    if (minutes > 0) return `${minutes}m`;
    return 'now';
  };

  return (
    <View style={styles.commentContainer}>
      {/* Main Comment */}
      <View style={styles.commentContent}>
        <Image
          source={{ uri: comment.userAvatar || 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=100' }}
          style={styles.avatar}
        />
        <View style={styles.commentBody}>
          <View style={styles.commentHeader}>
            <Text style={styles.userName}>{comment.userName}</Text>
            <Text style={styles.timeAgo}>{formatTimeAgo(comment.createdAt)}</Text>
          </View>
          <Text style={styles.commentText}>{comment.text}</Text>
          
          <View style={styles.commentActions}>
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={() => onLike(comment.commentId)}
            >
              <Heart size={14} color="#8E8E93" />
              <Text style={styles.actionText}>{comment.likes || 0}</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={() => onReply(comment.commentId, comment.userName)}
            >
              <MessageCircle size={14} color="#8E8E93" />
              <Text style={styles.actionText}>Reply</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.actionButton}>
              <MoreHorizontal size={14} color="#8E8E93" />
            </TouchableOpacity>
          </View>

          {/* Show Replies Toggle */}
          {comment.repliesArray && comment.repliesArray.length > 0 && (
            <TouchableOpacity 
              style={styles.showRepliesButton}
              onPress={() => setShowReplies(!showReplies)}
            >
              <Text style={styles.showRepliesText}>
                {showReplies ? 'Hide' : 'View'} {comment.repliesArray.length} {comment.repliesArray.length === 1 ? 'reply' : 'replies'}
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Replies */}
      {showReplies && comment.repliesArray && (
        <View style={styles.repliesContainer}>
          {comment.repliesArray.map((reply) => (
            <View key={reply.replyId} style={styles.replyContent}>
              <Image
                source={{ uri: reply.userAvatar || 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=100' }}
                style={styles.replyAvatar}
              />
              <View style={styles.replyBody}>
                <View style={styles.commentHeader}>
                  <Text style={styles.userName}>{reply.userName}</Text>
                  {reply.replyingTo && (
                    <Text style={styles.replyingTo}>@{reply.replyingTo}</Text>
                  )}
                  <Text style={styles.timeAgo}>{formatTimeAgo(reply.createdAt)}</Text>
                </View>
                <Text style={styles.commentText}>{reply.text}</Text>
                
                <View style={styles.commentActions}>
                  <TouchableOpacity 
                    style={styles.actionButton}
                    onPress={() => onLike(comment.commentId, true, reply.replyId)}
                  >
                    <Heart size={12} color="#8E8E93" />
                    <Text style={styles.actionText}>{reply.likes || 0}</Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity 
                    style={styles.actionButton}
                    onPress={() => onReply(comment.commentId, reply.userName)}
                  >
                    <MessageCircle size={12} color="#8E8E93" />
                    <Text style={styles.actionText}>Reply</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          ))}
        </View>
      )}
    </View>
  );
}

export default function CommentsModal({ visible, onClose, videoId, productName }: CommentsModalProps) {
  const [commentText, setCommentText] = useState('');
  const [replyingTo, setReplyingTo] = useState<{ commentId: string; userName: string } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const textInputRef = useRef<TextInput>(null);
  
  const { comments, loading, addComment, addReply, likeComment } = useVideoComments(videoId);

  const handleSubmit = async () => {
    if (!commentText.trim() || isSubmitting) return;

    setIsSubmitting(true);
    
    try {
      let success = false;
      
      if (replyingTo) {
        success = await addReply(replyingTo.commentId, commentText, replyingTo.userName);
      } else {
        success = await addComment(commentText);
      }

      if (success) {
        setCommentText('');
        setReplyingTo(null);
        textInputRef.current?.blur();
      }
    } catch (error) {
      console.error('Error submitting comment:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReply = (commentId: string, userName: string) => {
    setReplyingTo({ commentId, userName });
    textInputRef.current?.focus();
  };

  const cancelReply = () => {
    setReplyingTo(null);
    setCommentText('');
  };

  const handleLike = (commentId: string, isReply: boolean = false, replyId?: string) => {
    likeComment(commentId, isReply, replyId);
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <SafeAreaView style={styles.container} edges={['top']}>
        <KeyboardAvoidingView 
          style={styles.container}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <X size={24} color="#1C1C1E" />
            </TouchableOpacity>
            <View style={styles.headerContent}>
              <Text style={styles.headerTitle}>Comments</Text>
              <Text style={styles.headerSubtitle} numberOfLines={1}>{productName}</Text>
            </View>
            <View style={styles.placeholder} />
          </View>

          {/* Comments List */}
          <ScrollView 
            style={styles.commentsList}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            {loading ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#007AFF" />
                <Text style={styles.loadingText}>Loading comments...</Text>
              </View>
            ) : comments.length === 0 ? (
              <View style={styles.emptyContainer}>
                <MessageCircle size={48} color="#C7C7CC" />
                <Text style={styles.emptyTitle}>No comments yet</Text>
                <Text style={styles.emptySubtitle}>Be the first to share your thoughts!</Text>
              </View>
            ) : (
              comments.map((comment) => (
                <CommentItem
                  key={comment.commentId}
                  comment={comment}
                  onReply={handleReply}
                  onLike={handleLike}
                />
              ))
            )}
          </ScrollView>

          {/* Comment Input */}
          <View style={styles.inputContainer}>
            {replyingTo && (
              <View style={styles.replyingToContainer}>
                <Text style={styles.replyingToText}>
                  Replying to @{replyingTo.userName}
                </Text>
                <TouchableOpacity onPress={cancelReply}>
                  <X size={16} color="#8E8E93" />
                </TouchableOpacity>
              </View>
            )}
            
            <View style={styles.inputRow}>
              <Image
                source={{ uri: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=100' }}
                style={styles.inputAvatar}
              />
              <TextInput
                ref={textInputRef}
                style={styles.textInput}
                placeholder={replyingTo ? `Reply to ${replyingTo.userName}...` : "Add a comment..."}
                placeholderTextColor="#8E8E93"
                value={commentText}
                onChangeText={setCommentText}
                multiline
                maxLength={500}
                returnKeyType="default"
                blurOnSubmit={false}
              />
              <TouchableOpacity 
                style={[
                  styles.sendButton,
                  (!commentText.trim() || isSubmitting) && styles.sendButtonDisabled
                ]}
                onPress={handleSubmit}
                disabled={!commentText.trim() || isSubmitting}
              >
                {isSubmitting ? (
                  <ActivityIndicator size="small" color="#FFFFFF" />
                ) : (
                  <Send size={18} color="#FFFFFF" />
                )}
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F7',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
  },
  closeButton: {
    padding: 8,
  },
  headerContent: {
    flex: 1,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#1C1C1E',
  },
  headerSubtitle: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#8E8E93',
    marginTop: 2,
  },
  placeholder: {
    width: 40,
  },
  commentsList: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  loadingText: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#8E8E93',
    marginTop: 12,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
    paddingHorizontal: 32,
  },
  emptyTitle: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: '#1C1C1E',
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#8E8E93',
    textAlign: 'center',
  },
  commentContainer: {
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F2F2F7',
  },
  commentContent: {
    flexDirection: 'row',
    paddingHorizontal: 16,
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    marginRight: 12,
  },
  commentBody: {
    flex: 1,
  },
  commentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  userName: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#1C1C1E',
    marginRight: 8,
  },
  replyingTo: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#007AFF',
    marginRight: 8,
  },
  timeAgo: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#8E8E93',
    marginLeft: 'auto',
  },
  commentText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#1C1C1E',
    lineHeight: 20,
    marginBottom: 8,
  },
  commentActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  actionText: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#8E8E93',
  },
  showRepliesButton: {
    marginTop: 8,
  },
  showRepliesText: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
    color: '#007AFF',
  },
  repliesContainer: {
    marginTop: 12,
    paddingLeft: 48,
  },
  replyContent: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  replyAvatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    marginRight: 8,
  },
  replyBody: {
    flex: 1,
  },
  inputContainer: {
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E5E5EA',
    paddingBottom: Platform.OS === 'ios' ? 0 : 16,
  },
  replyingToContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#F2F2F7',
  },
  replyingToText: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#007AFF',
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
  },
  inputAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
  },
  textInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#E5E5EA',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#1C1C1E',
    backgroundColor: '#F2F2F7',
    maxHeight: 100,
  },
  sendButton: {
    backgroundColor: '#007AFF',
    borderRadius: 18,
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonDisabled: {
    backgroundColor: '#C7C7CC',
  },
});