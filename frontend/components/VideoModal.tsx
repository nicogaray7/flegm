import React from 'react';
import YouTubePlayer from './YouTubePlayer';

interface VideoModalProps {
  isOpen: boolean;
  onClose: () => void;
  youtubeId: string;
  title: string;
}

const VideoModal: React.FC<VideoModalProps> = ({ isOpen, onClose, youtubeId, title }) => {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75"
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-4xl mx-4"
        onClick={e => e.stopPropagation()}
      >
        <button
          className="absolute -top-10 right-0 text-white hover:text-gray-300"
          onClick={onClose}
        >
          <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        
        <YouTubePlayer
          youtubeId={youtubeId}
          title={title}
          className="rounded-lg shadow-2xl"
        />
      </div>
    </div>
  );
};

export default VideoModal; 