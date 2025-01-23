import { manipulateAsync } from 'expo-image-manipulator';

export const optimizeImage = async (uri) => {
  try {
    const result = await manipulateAsync(
      uri,
      [
        { resize: { width: 1080 } },
        { compress: 0.8 }
      ],
      { format: 'jpeg' }
    );
    return result.uri;
  } catch (error) {
    console.error('Erreur optimisation image:', error);
    return uri;
  }
}; 