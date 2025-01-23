import * as FileSystem from 'expo-file-system';
import { Platform } from 'react-native';
import { api } from './api';

const MAX_FILE_SIZE = 100 * 1024 * 1024; // 100MB
const ALLOWED_MIME_TYPES = ['video/mp4', 'video/quicktime'];

export const uploadVideo = async (videoUri, onProgress = () => {}) => {
  try {
    // Vérification de la taille du fichier
    const fileInfo = await FileSystem.getInfoAsync(videoUri);
    if (fileInfo.size > MAX_FILE_SIZE) {
      throw new Error('La vidéo est trop volumineuse (max 100MB)');
    }

    // Vérification du type MIME
    const mimeType = await getMimeType(videoUri);
    if (!ALLOWED_MIME_TYPES.includes(mimeType)) {
      throw new Error('Format de vidéo non supporté');
    }

    // Obtenir une signature sécurisée
    const { signature, timestamp, apiKey } = await api.get('/api/upload/signature');

    // Vérifier la validité de la signature
    if (!signature || !timestamp || !apiKey) {
      throw new Error('Signature invalide');
    }

    // Générer un nom de fichier sécurisé
    const secureFilename = generateSecureFilename(videoUri);

    const formData = new FormData();
    formData.append('file', {
      uri: videoUri,
      type: mimeType,
      name: secureFilename,
    });
    formData.append('api_key', apiKey);
    formData.append('timestamp', timestamp);
    formData.append('signature', signature);
    formData.append('folder', 'flegm_videos');
    formData.append('resource_type', 'video');
    formData.append('access_mode', 'authenticated'); // Accès restreint

    // Upload avec suivi de progression et timeout
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 30 * 60 * 1000); // 30min timeout

    const response = await FileSystem.uploadAsync(
      `https://api.cloudinary.com/v1_1/${process.env.EXPO_PUBLIC_CLOUDINARY_CLOUD_NAME}/video/upload`,
      videoUri,
      {
        uploadType: FileSystem.FileSystemUploadType.MULTIPART,
        fieldName: 'file',
        parameters: {
          api_key: apiKey,
          timestamp,
          signature,
          folder: 'flegm_videos',
          resource_type: 'video',
          access_mode: 'authenticated'
        },
        httpMethod: 'POST',
        sessionType: FileSystem.FileSystemSessionType.BACKGROUND,
        signal: controller.signal
      }
    );

    clearTimeout(timeout);
    return JSON.parse(response.body);
  } catch (error) {
    if (error.name === 'AbortError') {
      throw new Error('Upload timeout - Vidéo trop volumineuse ou connexion lente');
    }
    console.error('Erreur upload:', error);
    throw error;
  }
};

// Fonctions utilitaires
const getMimeType = async (uri) => {
  // Implémentation de la détection du type MIME
  const extension = uri.split('.').pop().toLowerCase();
  const mimeTypes = {
    mp4: 'video/mp4',
    mov: 'video/quicktime',
    m4v: 'video/mp4'
  };
  return mimeTypes[extension] || null;
};

const generateSecureFilename = (originalUri) => {
  const timestamp = Date.now();
  const randomString = Math.random().toString(36).substring(7);
  const extension = originalUri.split('.').pop();
  return `video_${timestamp}_${randomString}.${extension}`;
}; 