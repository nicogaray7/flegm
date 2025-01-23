import { useState, useEffect } from 'react';
import { Cloudinary } from "@cloudinary/url-gen";
import { videoTransforms } from '../utils/cloudinaryTransforms';

const cld = new Cloudinary({
  cloud: {
    cloudName: process.env.EXPO_PUBLIC_CLOUDINARY_CLOUD_NAME
  }
});

export const useCloudinaryVideo = (videoId) => {
  const [videoUrls, setVideoUrls] = useState({
    streaming: '',
    thumbnail: '',
    preview: ''
  });

  useEffect(() => {
    if (videoId) {
      const streamingUrl = cld.video(videoId)
        .quality('auto')
        .format('auto')
        .toURL();

      const thumbnailUrl = cld.video(videoId)
        .transformation(videoTransforms.thumbnail)
        .toURL();

      const previewUrl = cld.video(videoId)
        .transformation(videoTransforms.preview)
        .toURL();

      setVideoUrls({
        streaming: streamingUrl,
        thumbnail: thumbnailUrl,
        preview: previewUrl
      });
    }
  }, [videoId]);

  return videoUrls;
}; 