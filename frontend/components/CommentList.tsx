import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { fetchComments } from '../services/api';

interface Comment {
  _id: string;
  user: {
    username: string;
    avatar: string;
  };
  content: string;
  createdAt: string;
}

interface CommentListProps {
  postId: string;
}

export default function CommentList({ postId }: CommentListProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadComments();
  }, [postId]);

  const loadComments = async () => {
    try {
      const data = await fetchComments(postId);
      setComments(data);
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center my-5">Chargement...</div>;
  }

  return (
    <div>
      <h2 className="text-lg font-bold mb-4">Commentaires ({comments.length})</h2>
      {comments.map((item) => (
        <div key={item._id} className="flex mb-4">
          <img 
            src={item.user.avatar} 
            alt={`Avatar de ${item.user.username}`} 
            className="w-8 h-8 rounded-full mr-3"
          />
          <div className="flex-1">
            <div className="flex justify-between items-center mb-1">
              <span className="font-bold">{item.user.username}</span>
              <span className="text-xs text-gray-600">
                {format(new Date(item.createdAt), 'dd/MM/yyyy HH:mm', { locale: fr })}
              </span>
            </div>
            <p className="text-sm leading-relaxed">{item.content}</p>
          </div>
        </div>
      ))}
    </div>
  );
} 