import React, { useState } from 'react';
import { upvotePost } from '../services/api';

interface UpvoteButtonProps {
  postId: string;
  upvoteCount: number;
  isUpvoted: boolean;
}

export default function UpvoteButton({ 
  postId, 
  upvoteCount, 
  isUpvoted: initialIsUpvoted 
}: UpvoteButtonProps) {
  const [isUpvoted, setIsUpvoted] = useState(initialIsUpvoted);
  const [count, setCount] = useState(upvoteCount);

  const handleUpvote = async () => {
    try {
      await upvotePost(postId);
      setIsUpvoted(!isUpvoted);
      setCount(prev => isUpvoted ? prev - 1 : prev + 1);
    } catch (error) {
      console.error('Erreur lors du vote:', error);
    }
  };

  return (
    <button 
      onClick={handleUpvote}
      className={`flex items-center p-2 rounded-full transition-colors duration-200 ${
        isUpvoted 
          ? 'bg-purple-100 hover:bg-purple-200' 
          : 'bg-gray-100 hover:bg-gray-200'
      }`}
    >
      <svg 
        xmlns="http://www.w3.org/2000/svg" 
        viewBox="0 0 24 24" 
        className={`w-6 h-6 ${
          isUpvoted ? 'text-purple-600' : 'text-gray-600'
        }`}
      >
        {isUpvoted ? (
          <path d="M4 14h16a2 2 0 002-2V8a2 2 0 00-2-2H4a2 2 0 00-2 2v4a2 2 0 002 2z" />
        ) : (
          <path fillRule="evenodd" d="M12 3.75a.75.75 0 01.75.75v6.75h6.75a.75.75 0 010 1.5h-6.75v6.75a.75.75 0 01-1.5 0v-6.75H4.5a.75.75 0 010-1.5h6.75V4.5a.75.75 0 01.75-.75z" clipRule="evenodd" />
        )}
      </svg>
      <span className={`ml-1 text-sm ${
        isUpvoted ? 'text-purple-600' : 'text-gray-600'
      }`}>
        {count}
      </span>
    </button>
  );
} 