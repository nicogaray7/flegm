import React, { useState, useEffect } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { Appbar, Text, Avatar, Divider } from 'react-native-paper';
import { Video } from 'expo-av';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import CommentList from '../components/CommentList';
import CommentInput from '../components/CommentInput';
import UpvoteButton from '../components/UpvoteButton';
import TagList from '../components/TagList';
import { fetchPostDetails } from '../services/api';

export default function PostScreen({ route, navigation }) {
  const { postId } = route.params;
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPost();
  }, [postId]);

  const loadPost = async () => {
    try {
      const data = await fetchPostDetails(postId);
      setPost(data);
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!post) return null;

  return (
    <View style={styles.container}>
      <Appbar.Header>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content title={post.title} />
        <Appbar.Action icon="share" onPress={() => {/* Implémenter le partage */}} />
      </Appbar.Header>

      <ScrollView>
        <Video
          source={{ uri: post.videoUrl }}
          style={styles.video}
          useNativeControls
          resizeMode="contain"
        />

        <View style={styles.content}>
          <View style={styles.header}>
            <View style={styles.creatorInfo}>
              <Avatar.Image size={48} source={{ uri: post.creator.avatar }} />
              <View style={styles.creatorText}>
                <Text style={styles.creatorName}>{post.creator.username}</Text>
                <Text style={styles.date}>
                  {format(new Date(post.createdAt), 'dd MMMM yyyy', { locale: fr })}
                </Text>
              </View>
            </View>
            <UpvoteButton
              postId={post._id}
              upvoteCount={post.upvoteCount}
              isUpvoted={post.isUpvoted}
              size="large"
            />
          </View>

          <Text style={styles.description}>{post.description}</Text>
          <TagList tags={post.tags} />

          <Divider style={styles.divider} />
          
          <CommentList postId={postId} />
          <CommentInput postId={postId} onCommentAdded={loadPost} />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff'
  },
  video: {
    width: '100%',
    height: 240
  },
  content: {
    padding: 16
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16
  },
  creatorInfo: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  creatorText: {
    marginLeft: 12
  },
  creatorName: {
    fontSize: 16,
    fontWeight: 'bold'
  },
  date: {
    fontSize: 14,
    color: '#666'
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    marginVertical: 16
  },
  divider: {
    marginVertical: 16
  }
}); 