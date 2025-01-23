import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { TextInput, Button } from 'react-native-paper';
import { addComment } from '../services/api';

export default function CommentInput({ postId, onCommentAdded }) {
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!comment.trim()) return;

    setSubmitting(true);
    try {
      await addComment(postId, comment);
      setComment('');
      if (onCommentAdded) onCommentAdded();
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        mode="outlined"
        value={comment}
        onChangeText={setComment}
        placeholder="Ajouter un commentaire..."
        multiline
        style={styles.input}
      />
      <Button
        mode="contained"
        onPress={handleSubmit}
        loading={submitting}
        disabled={!comment.trim() || submitting}
        style={styles.button}
      >
        Publier
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#eee'
  },
  input: {
    marginBottom: 8
  },
  button: {
    alignSelf: 'flex-end'
  }
}); 