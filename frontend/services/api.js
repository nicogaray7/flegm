import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as FileSystem from 'expo-file-system';

const API_URL = process.env.REACT_APP_API_URL;

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Intercepteur pour ajouter le token aux requêtes
api.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const login = async (email, password) => {
  const response = await api.post('/api/users/login', { email, password });
  await AsyncStorage.setItem('token', response.data.token);
  return response.data;
};

export const register = async (userData) => {
  const response = await api.post('/api/users/register', userData);
  await AsyncStorage.setItem('token', response.data.token);
  return response.data;
};

export const fetchPosts = async () => {
  const response = await api.get('/api/posts');
  return response.data;
};

export const createPost = async (postData) => {
  const response = await api.post('/api/posts', postData);
  return response.data;
};

export const upvotePost = async (postId) => {
  const response = await api.post(`/api/posts/${postId}/upvote`);
  return response.data;
};

export const fetchComments = async (postId) => {
  const response = await api.get(`/api/posts/${postId}/comments`);
  return response.data;
};

export const addComment = async (postId, content) => {
  const response = await api.post(`/api/posts/${postId}/comments`, { content });
  return response.data;
};

export const fetchPostDetails = async (postId) => {
  const response = await api.get(`/api/posts/${postId}`);
  return response.data;
};

export const fetchUserProfile = async () => {
  const response = await api.get('/api/users/profile');
  return response.data;
};

export const fetchUserPosts = async () => {
  const response = await api.get('/api/users/posts');
  return response.data;
};

export const updateProfile = async (userData) => {
  const response = await api.put('/api/users/profile', userData);
  return response.data;
};

export const uploadVideo = async (videoUri) => {
  try {
    const formData = new FormData();
    
    // Préparation du fichier
    const videoInfo = await FileSystem.getInfoAsync(videoUri);
    formData.append('video', {
      uri: videoUri,
      type: 'video/mp4',
      name: 'video.mp4',
      size: videoInfo.size
    });

    const response = await api.post('/api/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      transformRequest: (data, headers) => {
        return formData;
      },
    });

    return response.data;
  } catch (error) {
    console.error('Erreur upload:', error);
    throw error;
  }
}; 