import React, { useState } from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { upvotePost } from '../services/api';

export default function UpvoteButton({ postId, upvoteCount, isUpvoted: initialIsUpvoted }) {
  const [isUpvoted, setIsUpvoted] = useState(initialIsUpvoted);
  const [count, setCount] = useState(upvoteCount);

  const handleUpvote = async () => {
    try {
      await upvotePost(postId);
      setIsUpvoted(!isUpvoted);
      setCount(prev => isUpvoted ? prev - 1 : prev + 1);
    } catch (error) {
      console.error('Erreur lors du vote:', error);
    }
  };

  return (
    <TouchableOpacity 
      style={[styles.button, isUpvoted && styles.buttonActive]}
      onPress={handleUpvote}
    >
      <Icon 
        name={isUpvoted ? 'arrow-up-bold' : 'arrow-up-bold-outline'} 
        size={24} 
        color={isUpvoted ? '#6200ee' : '#666'}
      />
      <Text style={[styles.count, isUpvoted && styles.countActive]}>
        {count}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    borderRadius: 20,
    backgroundColor: '#f0f0f0'
  },
  buttonActive: {
    backgroundColor: '#e8e0ff'
  },
  count: {
    marginLeft: 4,
    color: '#666'
  },
  countActive: {
    color: '#6200ee'
  }
}); 