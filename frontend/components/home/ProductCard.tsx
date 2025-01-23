import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface ProductCardProps {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  upvotes: number;
  comments: number;
  topics: string[];
}

const ProductCard = ({ id, title, description, imageUrl, upvotes, comments, topics }: ProductCardProps) => {
  return (
    <div className="flex items-start space-x-4 p-4 hover:bg-gray-50 transition-colors duration-200">
      <div className="flex-shrink-0">
        <Image
          src={imageUrl}
          alt={title}
          width={80}
          height={80}
          className="rounded-lg"
        />
      </div>
      
      <div className="flex-1 min-w-0">
        <Link href={`/posts/${id}`} className="block">
          <h2 className="text-lg font-medium text-gray-900 truncate">{title}</h2>
          <p className="text-sm text-gray-500 line-clamp-2">{description}</p>
          
          <div className="mt-2 flex items-center space-x-4">
            <div className="flex items-center space-x-1">
              <button className="flex items-center space-x-1 text-gray-500 hover:text-orange-500">
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                </svg>
                <span>{upvotes}</span>
              </button>
            </div>
            
            <div className="flex items-center space-x-1 text-gray-500">
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              <span>{comments}</span>
            </div>
          </div>

          <div className="mt-2 flex flex-wrap gap-2">
            {topics.map((topic, index) => (
              <span
                key={index}
                className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
              >
                {topic}
              </span>
            ))}
          </div>
        </Link>
      </div>
    </div>
  );
};

export default ProductCard; 