import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Intercepteur pour les requêtes
api.interceptors.request.use(
  (config) => {
    console.log('📤 Requête sortante:', {
      method: config.method?.toUpperCase(),
      url: config.url,
      headers: config.headers,
      data: config.data
    });
    return config;
  },
  (error) => {
    console.error('❌ Erreur de requête:', error);
    return Promise.reject(error);
  }
);

// Intercepteur pour les réponses
api.interceptors.response.use(
  (response) => {
    console.log('📥 Réponse reçue:', {
      status: response.status,
      statusText: response.statusText,
      headers: response.headers,
      data: response.data
    });
    return response;
  },
  (error) => {
    if (error.response) {
      console.error('❌ Erreur de réponse:', {
        status: error.response.status,
        statusText: error.response.statusText,
        headers: error.response.headers,
        data: error.response.data
      });
    } else if (error.request) {
      console.error('❌ Pas de réponse:', error.request);
    } else {
      console.error('❌ Erreur de configuration:', error.message);
    }
    return Promise.reject(error);
  }
);

export default api;
