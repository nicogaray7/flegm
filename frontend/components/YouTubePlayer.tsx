import React from 'react';

interface YouTubePlayerProps {
  youtubeId: string;
  title?: string;
  className?: string;
}

const YouTubePlayer: React.FC<YouTubePlayerProps> = ({ youtubeId, title, className = '' }) => {
  const origin = typeof window !== 'undefined' 
    ? encodeURIComponent(window.location.origin) 
    : '';

  return (
    <div className={`relative w-full pt-[56.25%] ${className}`}>
      <iframe
        className="absolute top-0 left-0 w-full h-full"
        src={`https://www.youtube.com/embed/${youtubeId}?rel=0&modestbranding=1&enablejsapi=1&origin=${origin}&playsinline=1`}
        title={title || 'YouTube video player'}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        loading="lazy"
      />
    </div>
  );
};

export default YouTubePlayer; 