import * as FileSystem from 'expo-file-system';
import { Platform } from 'react-native';

const CACHE_FOLDER = `${FileSystem.cacheDirectory}videos/`;
const MAX_CACHE_SIZE = 500 * 1024 * 1024; // 500MB

export const VideoCache = {
  async init() {
    const dirInfo = await FileSystem.getInfoAsync(CACHE_FOLDER);
    if (!dirInfo.exists) {
      await FileSystem.makeDirectoryAsync(CACHE_FOLDER);
    }
  },

  async getCachedVideo(url) {
    const filename = this._getFilename(url);
    const filePath = `${CACHE_FOLDER}${filename}`;
    const fileInfo = await FileSystem.getInfoAsync(filePath);
    
    if (fileInfo.exists) {
      return fileInfo.uri;
    }
    return null;
  },

  async cacheVideo(url) {
    const filename = this._getFilename(url);
    const filePath = `${CACHE_FOLDER}${filename}`;
    
    await this._ensureCacheSize();
    
    try {
      await FileSystem.downloadAsync(url, filePath);
      return filePath;
    } catch (error) {
      console.error('Erreur de cache vidéo:', error);
      return url;
    }
  },

  _getFilename(url) {
    return url.split('/').pop();
  },

  async _ensureCacheSize() {
    const dirInfo = await FileSystem.getInfoAsync(CACHE_FOLDER);
    if (dirInfo.size > MAX_CACHE_SIZE) {
      const contents = await FileSystem.readDirectoryAsync(CACHE_FOLDER);
      // Supprime les fichiers les plus anciens
      for (let file of contents.slice(0, contents.length / 2)) {
        await FileSystem.deleteAsync(`${CACHE_FOLDER}${file}`);
      }
    }
  }
}; 