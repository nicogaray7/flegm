import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { TextInput, Button, Appbar, Chip, ProgressBar } from 'react-native-paper';
import * as ImagePicker from 'expo-image-picker';
import { uploadVideo } from '../services/uploadService';
import SecureVideo from '../components/SecureVideo';
import { createPost } from '../services/api';

export default function NewPostScreen({ navigation }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [videoUri, setVideoUri] = useState('');
  const [uploadProgress, setUploadProgress] = useState(0);
  const [loading, setLoading] = useState(false);
  const [publicId, setPublicId] = useState(null);

  const pickVideo = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Videos,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      setVideoUri(result.assets[0].uri);
    }
  };

  const handleSubmit = async () => {
    if (!title.trim() || !description.trim() || !videoUri) return;

    setLoading(true);
    try {
      // Upload sécurisé
      const uploadResult = await uploadVideo(videoUri, (progress) => {
        setUploadProgress(progress);
      });

      // Créer le post avec l'ID public Cloudinary
      await createPost({
        title,
        description,
        videoId: uploadResult.public_id,
        thumbnailUrl: uploadResult.secure_url.replace(/\.[^/.]+$/, ".jpg")
      });

      navigation.navigate('Home');
    } catch (error) {
      console.error('Erreur:', error);
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
        <Button
          mode="outlined"
          onPress={pickVideo}
          style={styles.uploadButton}
          icon="video-plus"
          disabled={loading}
        >
          Sélectionner une vidéo
        </Button>

        {uploadProgress > 0 && uploadProgress < 1 && (
          <ProgressBar progress={uploadProgress} style={styles.progressBar} />
        )}

        {videoUri && (
          <SecureVideo
            publicId={publicId}
            style={styles.videoPreview}
          />
        )}

        <TextInput
          mode="outlined"
          label="Titre"
          value={title}
          onChangeText={setTitle}
          style={styles.input}
          disabled={loading}
        />

        <TextInput
          mode="outlined"
          label="Description"
          value={description}
          onChangeText={setDescription}
          multiline
          numberOfLines={4}
          style={styles.input}
          disabled={loading}
        />

        <Button
          mode="contained"
          onPress={handleSubmit}
          loading={loading}
          disabled={!title.trim() || !description.trim() || !videoUri || loading}
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
  uploadButton: {
    marginBottom: 16
  },
  videoPreview: {
    width: '100%',
    height: 200,
    marginBottom: 16
  },
  input: {
    marginBottom: 16
  },
  progressBar: {
    marginBottom: 16
  },
  submitButton: {
    marginTop: 8,
    marginBottom: 24
  }
}); 