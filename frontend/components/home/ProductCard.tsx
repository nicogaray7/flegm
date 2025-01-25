import React, { useState } from 'react';
import Link from 'next/link';
import { Post } from '../../types/post';
import VideoModal from '../VideoModal';

interface ProductCardProps {
  post: Post;
}

const ProductCard = ({ post }: ProductCardProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [upvoteCount, setUpvoteCount] = useState(post.upvoteCount);
  const [isUpvoted, setIsUpvoted] = useState(false);
  const [commentClicked, setCommentClicked] = useState(false);
  const [upvoteAnimation, setUpvoteAnimation] = useState(false);

  const handleUpvote = async (e: React.MouseEvent) => {
    e.preventDefault(); // Empêche la navigation
    e.stopPropagation(); // Arrête la propagation de l'événement

    // Déclencher l'animation
    setUpvoteAnimation(true);
    
    // Réinitialiser l'animation après 300ms
    setTimeout(() => {
      setUpvoteAnimation(false);
    }, 300);

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        // Rediriger vers la connexion si non connecté
        return;
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/posts/${post._id}/upvote`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const updatedPost = await response.json();
        setUpvoteCount(updatedPost.upvoteCount);
        setIsUpvoted(!isUpvoted);
      }
    } catch (error) {
      console.error('Erreur lors du vote', error);
    }
  };

  const handleCommentClick = () => {
    setCommentClicked(!commentClicked);
  };

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
            
            <div className="mt-2 flex items-center space-x-4">
              <button 
                type="button" 
                className="styles_reset__0clCw"
                data-test="comment-button"
                onClick={handleCommentClick}
              >
                <div 
                  className="group/accessory flex size-12 flex-col items-center justify-center gap-1 rounded-xl border-2 border-gray-200 dark:border-gray-dark-800 bg-white transition-all duration-300 hover:border-[#FF6154] dark:hover:border-[#FF6154]"
                  data-filled={commentClicked ? "true" : "false"}
                >
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    width="14" 
                    height="14" 
                    fill="none" 
                    viewBox="0 0 14 14" 
                    className="stroke-[#344054] text-[#344054] group-hover:stroke-[#FF6154] group-hover:text-[#FF6154] group-data-[filled=true]/accessory:stroke-[#FF6154] group-data-[filled=true]/accessory:text-[#FF6154] size-[14px] stroke-[1.5px]"
                  >
                    <path 
                      stroke="#344054" 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth="1.5" 
                      d="M12.25 6.708a4.958 4.958 0 0 1-6.74 4.629 2 2 0 0 0-.192-.068.5.5 0 0 0-.11-.014 1.4 1.4 0 0 0-.176.012l-2.987.309c-.285.03-.427.044-.511-.007a.3.3 0 0 1-.137-.204c-.015-.097.053-.223.19-.475l.953-1.766c.079-.146.118-.218.136-.288a.5.5 0 0 0 .016-.19c-.006-.072-.037-.166-.1-.353a4.958 4.958 0 1 1 9.658-1.585"
                    ></path>
                  </svg>
                  <div className="text-14 font-semibold text-[#344054] leading-none group-hover:text-[#FF6154] group-data-[filled=true]/accessory:text-[#FF6154]">
                    {post.commentCount}
                  </div>
                </div>
              </button>

              <button 
                type="button" 
                className="styles_reset__0clCw"
                data-test="vote-button"
                onClick={handleUpvote}
              >
                <div 
                  className={`group/accessory flex size-12 flex-col items-center justify-center gap-1 rounded-xl border-2 border-gray-200 dark:border-gray-dark-800 bg-white transition-all duration-300 hover:border-[#FF6154] dark:hover:border-[#FF6154] ${upvoteAnimation ? 'styles_animation__iT31' : ''}`}
                  data-filled={isUpvoted ? "true" : "false"}
                >
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    width="16" 
                    height="16" 
                    fill="none" 
                    viewBox="0 0 16 16" 
                    className="fill-white stroke-[#344054] stroke-[1.5px] transition-all duration-300 group-hover:stroke-[#FF6154] group-hover:fill-[#FF6154] group-data-[filled=true]/accessory:fill-[#FF6154] group-data-[filled=true]/accessory:stroke-[#FF6154]"
                  >
                    <path d="M6.579 3.467c.71-1.067 2.132-1.067 2.842 0L12.975 8.8c.878 1.318.043 3.2-1.422 3.2H4.447c-1.464 0-2.3-1.882-1.422-3.2z"></path>
                  </svg>
                  <div className="text-14 font-semibold text-[#344054] leading-none group-hover:text-[#FF6154] group-data-[filled=true]/accessory:text-[#FF6154]">
                    {upvoteCount}
                  </div>
                </div>
              </button>
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

      {isModalOpen && (
        <VideoModal 
          isOpen={isModalOpen}
          youtubeId={post.youtubeId} 
          title={post.title} 
          onClose={() => setIsModalOpen(false)} 
        />
      )}
    </>
  );
};

export default ProductCard;