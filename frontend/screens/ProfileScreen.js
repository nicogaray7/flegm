import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import { Appbar, Avatar, Text, Button, Divider, ActivityIndicator } from 'react-native-paper';
import VideoCard from '../components/VideoCard';
import { fetchUserProfile, fetchUserPosts } from '../services/api';

export default function ProfileScreen({ navigation, route }) {
  const [profile, setProfile] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadProfile = async () => {
    try {
      const profileData = await fetchUserProfile();
      const postsData = await fetchUserPosts();
      setProfile(profileData);
      setPosts(postsData);
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadProfile();
  }, []);

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#FF6154" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Appbar.Header>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content title="Profil" />
        <Appbar.Action icon="cog" onPress={() => navigation.navigate('Settings')} />
      </Appbar.Header>

      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={loadProfile} />
        }
      >
        <View style={styles.header}>
          <Avatar.Image
            size={80}
            source={{ uri: profile?.avatar }}
            style={styles.avatar}
          />
          <Text style={styles.username}>{profile?.username}</Text>
          {profile?.isCreator && (
            <Text style={styles.creatorBadge}>Créateur</Text>
          )}
        </View>

        <View style={styles.stats}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{posts.length}</Text>
            <Text style={styles.statLabel}>Vidéos</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{profile?.totalUpvotes || 0}</Text>
            <Text style={styles.statLabel}>Upvotes</Text>
          </View>
        </View>

        <Divider style={styles.divider} />

        <View style={styles.content}>
          {posts.map(post => (
            <VideoCard
              key={post._id}
              post={post}
              onPress={() => navigation.navigate('Post', { postId: post._id })}
            />
          ))}
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
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  header: {
    alignItems: 'center',
    padding: 20
  },
  avatar: {
    marginBottom: 12
  },
  username: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4
  },
  creatorBadge: {
    color: '#FF6154',
    fontSize: 16
  },
  stats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 20
  },
  statItem: {
    alignItems: 'center'
  },
  statNumber: {
    fontSize: 20,
    fontWeight: 'bold'
  },
  statLabel: {
    color: '#666'
  },
  divider: {
    marginVertical: 16
  },
  content: {
    padding: 16
  }
}); 