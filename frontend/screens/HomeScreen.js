import React, { useState, useEffect } from 'react';
import { View, FlatList, StyleSheet, RefreshControl } from 'react-native';
import { ActivityIndicator, Appbar } from 'react-native-paper';
import VideoCard from '../components/VideoCard';
import DayHeader from '../components/DayHeader';
import { fetchPosts } from '../services/api';

export default function HomeScreen({ navigation }) {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadPosts = async () => {
    try {
      const data = await fetchPosts();
      // Grouper les posts par date
      const groupedPosts = groupPostsByDate(data);
      setPosts(groupedPosts);
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadPosts();
  }, []);

  const renderHeader = () => (
    <Appbar.Header style={styles.header}>
      <Appbar.Content title="Flegm" subtitle="Découvrez les meilleurs créateurs" />
      <Appbar.Action icon="plus" onPress={() => navigation.navigate('NewPost')} />
      <Appbar.Action icon="account" onPress={() => navigation.navigate('Profile')} />
    </Appbar.Header>
  );

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#FF6154" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {renderHeader()}
      <FlatList
        data={posts}
        renderItem={({ item, index }) => (
          <>
            <DayHeader date={item.date} isToday={index === 0} />
            {item.posts.map(post => (
              <VideoCard
                key={post._id}
                post={post}
                onPress={() => navigation.navigate('Post', { postId: post._id })}
              />
            ))}
          </>
        )}
        keyExtractor={item => item.date}
        refreshControl={
          <RefreshControl 
            refreshing={refreshing} 
            onRefresh={loadPosts}
            colors={['#FF6154']} 
          />
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9'
  },
  header: {
    backgroundColor: '#fff',
    elevation: 2
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  }
}); 