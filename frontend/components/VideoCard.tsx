import React, { useState } from 'react';
import Image from 'next/image';
import UpvoteButton from './UpvoteButton';
import TagList from './TagList';
import { useCloudinaryVideo } from '../hooks/useCloudinaryVideo';

interface VideoCardProps {
  post: {
    _id: string;
    videoId: string;
    title: string;
    description: string;
    creator: {
      avatar: string;
      username: string;
    };
    tags: string[];
    upvoteCount: number;
    isUpvoted: boolean;
  };
  onPress: () => void;
}

export default function VideoCard({ post, onPress }: VideoCardProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const { streaming, thumbnail } = useCloudinaryVideo(post.videoId);

  return (
    <div className="bg-white rounded-lg shadow-md m-2 p-3">
      <div onClick={onPress} className="cursor-pointer">
        <div className="flex">
          {!isPlaying ? (
            <div 
              className="relative w-[120px] h-[90px] rounded-lg overflow-hidden mr-3"
              onClick={() => setIsPlaying(true)}
            >
              <Image
                src={thumbnail}
                alt={post.title}
                layout="fill"
                objectFit="cover"
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  viewBox="0 0 24 24" 
                  fill="white" 
                  className="w-10 h-10"
                >
                  <path fillRule="evenodd" d="M4.5 5.653c0-1.426 1.529-2.33 2.779-1.643l11.54 6.348c1.295.712 1.295 2.573 0 3.285L7.28 19.991c-1.25.687-2.779-.217-2.779-1.643V5.653z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
          ) : (
            <video
              src={streaming}
              controls
              className="w-full h-[200px] rounded-lg"
              onEnded={() => setIsPlaying(false)}
              autoPlay
            />
          )}
          
          <div className="flex-1 flex flex-col justify-between">
            <div>
              <h3 className="text-base font-bold mb-1 line-clamp-2">
                {post.title}
              </h3>
              <p className="text-sm text-gray-600 line-clamp-2">
                {post.description}
              </p>
            </div>

            <div className="flex justify-between items-center mt-2">
              <div className="flex items-center">
                <Image 
                  src={post.creator.avatar} 
                  alt={post.creator.username}
                  width={24} 
                  height={24} 
                  className="rounded-full"
                />
                <span className="ml-2 text-sm text-gray-600">
                  {post.creator.username}
                </span>
              </div>
              
              <UpvoteButton 
                postId={post._id}
                upvoteCount={post.upvoteCount}
                isUpvoted={post.isUpvoted}
              />
            </div>

            <TagList tags={post.tags} />
          </div>
        </div>
      </div>
    </div>
  );
} 