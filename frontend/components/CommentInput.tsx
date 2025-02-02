import React, { useState } from 'react';
import { addComment } from '../services/api';

interface CommentInputProps {
  postId: string;
  onCommentAdded?: () => void;
}

export default function CommentInput({ postId, onCommentAdded }: CommentInputProps) {
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!comment.trim()) return;

    setSubmitting(true);
    try {
      await addComment(postId, comment);
      setComment('');
      if (onCommentAdded) onCommentAdded();
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="p-4 bg-white border-t border-gray-200">
      <textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder="Ajouter un commentaire..."
        className="w-full p-2 mb-2 border rounded-md"
        rows={4}
      />
      <button
        onClick={handleSubmit}
        disabled={!comment.trim() || submitting}
        className={`px-4 py-2 text-white rounded-md self-end ${
          submitting || !comment.trim() 
            ? 'bg-gray-400 cursor-not-allowed' 
            : 'bg-blue-500 hover:bg-blue-600'
        }`}
      >
        {submitting ? 'Publication...' : 'Publier'}
      </button>
    </div>
  );
} 