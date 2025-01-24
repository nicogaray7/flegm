import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { TextInput, Button, Appbar } from 'react-native-paper';
import { createPost } from '../services/api';
import YouTubePlayer from '../components/YouTubePlayer';

export default function NewPostScreen({ navigation }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [youtubeId, setYoutubeId] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const extractYoutubeId = (url) => {
    const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
    return match ? match[1] : null;
  };

  const handleYoutubeUrlChange = (url) => {
    setYoutubeUrl(url);
    const id = extractYoutubeId(url);
    setYoutubeId(id);
    setError(!id ? 'URL YouTube invalide' : '');
  };

  const handleSubmit = async () => {
    if (!title.trim() || !description.trim() || !youtubeId) return;

    setLoading(true);
    try {
      await createPost({
        title,
        description,
        youtubeUrl,
        youtubeId
      });

      navigation.navigate('Home');
    } catch (error) {
      console.error('Erreur:', error);
      setError('Erreur lors de la création du post');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Appbar.Header>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content title="Nouvelle vidéo" />
      </Appbar.Header>

      <ScrollView style={styles.content}>
        <TextInput
          mode="outlined"
          label="URL YouTube"
          value={youtubeUrl}
          onChangeText={handleYoutubeUrlChange}
          placeholder="https://youtube.com/watch?v=..."
          error={!!error}
          style={styles.input}
        />
        {error && (
          <Text style={styles.errorText}>{error}</Text>
        )}

        {youtubeId && (
          <YouTubePlayer
            youtubeId={youtubeId}
            className="my-4"
          />
        )}

        <TextInput
          mode="outlined"
          label="Titre"
          value={title}
          onChangeText={setTitle}
          style={styles.input}
        />

        <TextInput
          mode="outlined"
          label="Description"
          value={description}
          onChangeText={setDescription}
          multiline
          numberOfLines={4}
          style={styles.input}
        />

        <Button
          mode="contained"
          onPress={handleSubmit}
          loading={loading}
          disabled={!title.trim() || !description.trim() || !youtubeId || loading}
          style={styles.submitButton}
        >
          Publier
        </Button>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff'
  },
  content: {
    padding: 16
  },
  input: {
    marginBottom: 16
  },
  errorText: {
    color: '#B00020',
    fontSize: 12,
    marginTop: -12,
    marginBottom: 16
  },
  submitButton: {
    marginTop: 8,
    marginBottom: 24
  }
}); 