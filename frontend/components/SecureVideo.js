import React, { useEffect, useState } from 'react';
import { Video } from 'expo-av';
import { Cloudinary } from "@cloudinary/url-gen";
import { fill } from "@cloudinary/url-gen/actions/resize";
import { VideoCache } from '../utils/videoCache';

const cld = new Cloudinary({
  cloud: {
    cloudName: process.env.EXPO_PUBLIC_CLOUDINARY_CLOUD_NAME
  }
});

export default function SecureVideo({ publicId, style }) {
  const [videoUrl, setVideoUrl] = useState(null);

  useEffect(() => {
    const loadVideo = async () => {
      try {
        // Génère l'URL avec transformation
        const myVideo = cld.video(publicId)
          .resize(fill().width(720).height(480))
          .quality('auto')
          .format('mp4');

        const url = myVideo.toURL();

        // Vérifie le cache
        const cachedUrl = await VideoCache.getCachedVideo(url);
        if (cachedUrl) {
          setVideoUrl(cachedUrl);
        } else {
          const newCachedUrl = await VideoCache.cacheVideo(url);
          setVideoUrl(newCachedUrl);
        }
      } catch (error) {
        console.error('Erreur chargement vidéo:', error);
      }
    };

    loadVideo();
  }, [publicId]);

  if (!videoUrl) return null;

  return (
    <Video
      source={{ uri: videoUrl }}
      style={style}
      useNativeControls
      resizeMode="contain"
      isLooping={false}
      shouldPlay={false}
    />
  );
} 