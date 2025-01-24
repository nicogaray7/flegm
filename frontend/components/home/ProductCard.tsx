import React, { useState } from 'react';
import Link from 'next/link';
import { Post } from '../../types/post';
import VideoModal from '../VideoModal';

interface ProductCardProps {
  post: Post;
}

const ProductCard = ({ post }: ProductCardProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <div className="flex items-start space-x-4 p-4 hover:bg-gray-50 transition-colors duration-200">
        <div 
          className="flex-shrink-0 relative cursor-pointer group"
          onClick={() => setIsModalOpen(true)}
        >
          <img
            src={`https://img.youtube.com/vi/${post.youtubeId}/mqdefault.jpg`}
            alt={post.title}
            className="w-[320px] h-[180px] rounded-lg object-cover"
          />
          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-opacity duration-200">
            <svg 
              className="w-12 h-12 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200" 
              fill="currentColor" 
              viewBox="0 0 24 24"
            >
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
        </div>
        
        <div className="flex-1 min-w-0">
          <Link href={`/posts/${post._id}`} className="block">
            <div className="flex items-center space-x-2">
              <img
                src={post.creator.avatar}
                alt={post.creator.username}
                className="w-6 h-6 rounded-full"
              />
              <span className="text-sm text-gray-600">{post.creator.username}</span>
            </div>
            
            <h2 className="text-lg font-medium text-gray-900 truncate mt-2">{post.title}</h2>
            <p className="text-sm text-gray-500 line-clamp-2">{post.description}</p>
            
            <div className="mt-2 flex items-center space-x-4">
              <div className="flex items-center space-x-1">
                <button className="flex items-center space-x-1 text-gray-500 hover:text-orange-500">
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                  </svg>
                  <span>{post.upvoteCount}</span>
                </button>
              </div>
              
              <div className="flex items-center space-x-1 text-gray-500">
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                <span>{post.commentCount}</span>
              </div>
            </div>

            <div className="mt-2 flex flex-wrap gap-2">
              {post.tags.map((tag, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
                >
                  {tag}
                </span>
              ))}
            </div>
          </Link>
        </div>
      </div>

      <VideoModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        youtubeId={post.youtubeId}
        title={post.title}
      />
    </>
  );
};

export default ProductCard; 