import React, { useState, useEffect } from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import { Text, Avatar, ActivityIndicator } from 'react-native-paper';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { fetchComments } from '../services/api';

export default function CommentList({ postId }) {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadComments();
  }, [postId]);

  const loadComments = async () => {
    try {
      const data = await fetchComments(postId);
      setComments(data);
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <ActivityIndicator style={styles.loader} />;
  }

  return (
    <View>
      <Text style={styles.title}>Commentaires ({comments.length})</Text>
      <FlatList
        data={comments}
        renderItem={({ item }) => (
          <View style={styles.commentContainer}>
            <Avatar.Image 
              size={32} 
              source={{ uri: item.user.avatar }} 
              style={styles.avatar}
            />
            <View style={styles.commentContent}>
              <View style={styles.commentHeader}>
                <Text style={styles.username}>{item.user.username}</Text>
                <Text style={styles.date}>
                  {format(new Date(item.createdAt), 'dd/MM/yyyy HH:mm', { locale: fr })}
                </Text>
              </View>
              <Text style={styles.commentText}>{item.content}</Text>
            </View>
          </View>
        )}
        keyExtractor={item => item._id}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16
  },
  loader: {
    marginVertical: 20
  },
  commentContainer: {
    flexDirection: 'row',
    marginBottom: 16
  },
  avatar: {
    marginRight: 12
  },
  commentContent: {
    flex: 1
  },
  commentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4
  },
  username: {
    fontWeight: 'bold'
  },
  date: {
    fontSize: 12,
    color: '#666'
  },
  commentText: {
    fontSize: 14,
    lineHeight: 20
  }
}); 