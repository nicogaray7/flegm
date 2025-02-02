import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Post } from '../../types/post';
import VideoModal from '../VideoModal';

interface ProductCardProps {
  post: Post;
}

const ProductCard: React.FC<ProductCardProps> = ({ post }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isUpvoted, setIsUpvoted] = useState(() => {
    const userId = localStorage.getItem('userId');
    return userId ? post.upvotes?.includes(userId) || false : false;
  });
  const [upvoteAnimation, setUpvoteAnimation] = useState(false);

  const handleUpvote = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    // Vérification côté client
    if (typeof window === 'undefined') {
      console.error('Tentative de vote côté serveur');
      return;
    }

    // Récupération sécurisée du token et de l'userId
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    const userId = typeof window !== 'undefined' ? localStorage.getItem('userId') : null;

    // Vérification de la connexion
    if (!token || !userId) {
      console.error('Utilisateur non connecté');
      // Redirection vers la page de connexion
      window.location.href = '/login';
      return;
    }

    setUpvoteAnimation(true);
    
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/posts/${post._id}/upvote`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const updatedPost = await response.json();
        
        // Mise à jour directe basée sur la réponse du serveur
        post.upvoteCount = updatedPost.upvoteCount;
        post.upvotes = updatedPost.upvotes;
        
        // Vérifier si l'utilisateur a déjà upvoté
        const hasUpvoted = updatedPost.upvotes.includes(userId);
        setIsUpvoted(hasUpvoted);
      } else {
        const errorText = await response.text();
        console.error('Erreur de réponse:', errorText);
        
        // Gestion des erreurs d'authentification
        if (response.status === 401) {
          window.location.href = '/login';
        }
      }
    } catch (error) {
      console.error('Erreur lors du vote', error);
    } finally {
      setTimeout(() => setUpvoteAnimation(false), 500);
    }
  };

  return (
    <div className="flex flex-col sm:flex-row items-start space-y-4 sm:space-y-0 sm:space-x-4 p-4 border-b border-gray-200 hover:bg-gray-50 transition-colors duration-200">
      {/* Thumbnail */}
      <div 
        className="relative w-full sm:w-48 aspect-video rounded-lg overflow-hidden cursor-pointer group"
        onClick={() => setIsModalOpen(true)}
      >
        <Image
          src={`https://img.youtube.com/vi/${post.youtubeId}/mqdefault.jpg`}
          alt={post.title}
          layout="fill"
          objectFit="cover"
          priority={true}
          sizes="(max-width: 640px) 100vw, 192px"
          className="transition-transform duration-200 group-hover:scale-105"
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

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between">
          <div className="flex-1 min-w-0">
            {/* Informations de l'auteur */}
            <div className="flex items-center space-x-2 mb-2">
              {post.isCreator ? (
                <span className="text-sm text-gray-600">
                  Posté par <strong>{post.youtubeChannel?.name}</strong>
                </span>
              ) : (
                <span className="text-sm text-gray-600">
                  Vidéo de <strong>{post.youtubeChannel?.name}</strong> postée par <strong>{post.creator?.username || 'Anonyme'}</strong>
                </span>
              )}
            </div>

            <h2 className="text-base sm:text-lg font-semibold text-gray-900 mb-1">
              <Link href={`/posts/${post._id}`} className="hover:text-[#A63429] line-clamp-2">
                {post.title}
              </Link>
            </h2>
            
            {/* Metadata */}
            <div className="flex items-center mt-2 text-sm text-gray-500">
              <div className="flex items-center space-x-4">
                {/* Upvotes */}
                <button 
                  type="button" 
                  className="styles_reset__0clCw group"
                  onClick={handleUpvote}
                >
                  <div 
                    className={`group/accessory flex items-center space-x-2 px-3 py-2 rounded-xl border-2 border-gray-200 dark:border-gray-dark-800 bg-white transition-all duration-300 hover:border-[#FF6154] dark:hover:border-[#FF6154] ${upvoteAnimation ? 'animate-bounce' : ''}`}
                    data-filled={isUpvoted ? "true" : "false"}
                  >
                    <svg 
                      xmlns="http://www.w3.org/2000/svg" 
                      width="16" 
                      height="16" 
                      fill="none" 
                      viewBox="0 0 16 16" 
                      className={`stroke-[1.5px] transition-all duration-300 ${
                        isUpvoted 
                          ? 'fill-[#FF6154] stroke-[#FF6154]' 
                          : 'fill-white stroke-[#344054] group-hover:stroke-[#FF6154] group-hover:fill-[#FF6154]'
                      }`}
                    >
                      <path d="M6.579 3.467c.71-1.067 2.132-1.067 2.842 0L12.975 8.8c.878 1.318.043 3.2-1.422 3.2H4.447c-1.464 0-2.3-1.882-1.422-3.2z"></path>
                    </svg>
                    <div className={`text-14 font-semibold leading-none transition-colors duration-300 ${
                      isUpvoted 
                        ? 'text-[#FF6154]' 
                        : 'text-[#344054] group-hover:text-[#FF6154]'
                    }`}>
                      {post.upvoteCount}
                    </div>
                  </div>
                </button>

                {/* Comments */}
                <button 
                  type="button" 
                  className="styles_reset__0clCw group"
                >
                  <div 
                    className="group/accessory flex items-center space-x-2 px-3 py-2 rounded-xl border-2 border-gray-200 dark:border-gray-dark-800 bg-white transition-all duration-300 hover:border-[#FF6154] dark:hover:border-[#FF6154]"
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
                      {post.comments?.length || 0}
                    </div>
                  </div>
                </button>
              </div>
            </div>

            {/* Tags */}
            <div className="mt-2 flex flex-wrap items-center gap-2">
              {post.tags?.map((tag, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
                >
                  {tag}
                </span>
              ))}
              <span className="text-xs text-gray-500">
                • {new Date(post.createdAt).toLocaleDateString('fr-FR', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric'
                })}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Modal vidéo YouTube */}
      {isModalOpen && (
        <VideoModal 
          isOpen={isModalOpen}
          youtubeId={post.youtubeId}
          title={post.title}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </div>
  );
};

export default ProductCard;