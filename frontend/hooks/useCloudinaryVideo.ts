import { useState, useEffect } from 'react';
import { Cloudinary } from "@cloudinary/url-gen";
import { videoTransforms } from '../utils/cloudinaryTransforms';

const cld = new Cloudinary({
  cloud: {
    cloudName: process.env.EXPO_PUBLIC_CLOUDINARY_CLOUD_NAME
  }
});

export const useCloudinaryVideo = (videoId: string) => {
  const [videoUrls, setVideoUrls] = useState({
    streaming: '',
    thumbnail: '',
    preview: ''
  });
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!videoId) {
      console.warn('❌ useCloudinaryVideo: Aucun videoId fourni');
      return;
    }

    try {
      console.log('🎥 Génération URL Cloudinary pour:', videoId);
      console.log('☁️ Cloud name:', process.env.EXPO_PUBLIC_CLOUDINARY_CLOUD_NAME);
      
      const streamingUrl = cld.video(videoId)
        .quality('auto')
        .format('auto')
        .toURL();

      const thumbnailUrl = cld.video(videoId)
        .addTransformation(videoTransforms.thumbnail)
        .toURL();

      const previewUrl = cld.video(videoId)
        .addTransformation(videoTransforms.preview)
        .toURL();

      console.log('✅ URL générée pour streaming:', streamingUrl);
      console.log('✅ URL générée pour thumbnail:', thumbnailUrl);
      console.log('✅ URL générée pour preview:', previewUrl);
      setVideoUrls({
        streaming: streamingUrl,
        thumbnail: thumbnailUrl,
        preview: previewUrl
      });
      setError(null);
    } catch (err) {
      console.error('❌ Erreur Cloudinary:', err);
      setError(err as Error);
      setVideoUrls({
        streaming: '',
        thumbnail: '',
        preview: ''
      });
    }
  }, [videoId]);

  return { videoUrls, error };
}; 