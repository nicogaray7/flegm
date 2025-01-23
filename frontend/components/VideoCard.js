import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Surface, Text, Avatar } from 'react-native-paper';
import { Video } from 'expo-av';
import UpvoteButton from './UpvoteButton';
import TagList from './TagList';
import { Video as CloudinaryVideo } from "@cloudinary/react-native";
import cld from '../config/cloudinary';
import { useCloudinaryVideo } from '../hooks/useCloudinaryVideo';
import { Icon } from 'react-native-elements';

export default function VideoCard({ post, onPress }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const { streaming, thumbnail } = useCloudinaryVideo(post.videoId);

  return (
    <Surface style={styles.card}>
      <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
        <View style={styles.container}>
          {!isPlaying ? (
            <TouchableOpacity 
              style={styles.thumbnailContainer}
              onPress={() => setIsPlaying(true)}
            >
              <Image
                source={{ uri: thumbnail }}
                style={styles.thumbnail}
                resizeMode="cover"
              />
              <View style={styles.playButton}>
                <Icon name="play" size={40} color="#fff" />
              </View>
            </TouchableOpacity>
          ) : (
            <CloudinaryVideo
              source={{ uri: streaming }}
              style={styles.video}
              useNativeControls
              resizeMode="contain"
              shouldPlay
              onPlaybackStatusUpdate={status => {
                if (status.didJustFinish) {
                  setIsPlaying(false);
                }
              }}
            />
          )}
          
          <View style={styles.content}>
            <View style={styles.header}>
              <Text style={styles.title} numberOfLines={2}>
                {post.title}
              </Text>
              <Text style={styles.description} numberOfLines={2}>
                {post.description}
              </Text>
            </View>

            <View style={styles.footer}>
              <View style={styles.creatorInfo}>
                <Avatar.Image 
                  size={24} 
                  source={{ uri: post.creator.avatar }} 
                />
                <Text style={styles.creatorName}>
                  {post.creator.username}
                </Text>
              </View>
              
              <UpvoteButton 
                postId={post._id}
                upvoteCount={post.upvoteCount}
                isUpvoted={post.isUpvoted}
              />
            </View>

            <TagList tags={post.tags} />
          </View>
        </View>
      </TouchableOpacity>
    </Surface>
  );
}

const styles = StyleSheet.create({
  card: {
    margin: 8,
    backgroundColor: '#fff',
    borderRadius: 8,
    elevation: 2
  },
  container: {
    flexDirection: 'row',
    padding: 12
  },
  thumbnailContainer: {
    width: 120,
    height: 90,
    borderRadius: 8,
    overflow: 'hidden',
    marginRight: 12
  },
  thumbnail: {
    width: '100%',
    height: '100%'
  },
  content: {
    flex: 1,
    justifyContent: 'space-between'
  },
  header: {
    flex: 1
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4
  },
  description: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8
  },
  creatorInfo: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  creatorName: {
    marginLeft: 8,
    fontSize: 14,
    color: '#666'
  },
  video: {
    width: '100%',
    height: 200,
    marginTop: 12,
    borderRadius: 8,
    overflow: 'hidden'
  },
  playButton: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center'
  }
}); 