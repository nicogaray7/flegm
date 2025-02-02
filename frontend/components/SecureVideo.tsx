import React, { useEffect, useState } from 'react';
import { Cloudinary } from "@cloudinary/url-gen";
import { fill } from "@cloudinary/url-gen/actions/resize";
import { VideoCache } from '../utils/videoCache';

const cld = new Cloudinary({
  cloud: {
    cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
  }
});

interface SecureVideoProps {
  publicId: string;
  style?: React.CSSProperties;
  className?: string;
}

export default function SecureVideo({ 
  publicId, 
  style, 
  className 
}: SecureVideoProps) {
  const [videoUrl, setVideoUrl] = useState<string | null>(null);

  useEffect(() => {
    const loadVideo = async () => {
      try {
        const myVideo = cld.video(publicId)
          .resize(fill().width(720).height(480))
          .quality('auto')
          .format('mp4');

        const url = myVideo.toURL();
        const cachedUrl = await VideoCache.getCachedVideo(url);
        
        setVideoUrl(cachedUrl || url);
      } catch (error) {
        console.error('Erreur chargement vidéo:', error);
      }
    };

    loadVideo();
  }, [publicId]);

  if (!videoUrl) return null;

  return (
    <video
      src={videoUrl}
      style={style}
      className={`${className || ''}`}
      controls
      controlsList="nodownload"
    />
  );
} 