import React, { useState } from 'react';
import { useRouter } from 'next/router';

interface CreatePostFormProps {
  token: string;
}

const CreatePostForm: React.FC<CreatePostFormProps> = ({ token }) => {
  const [videoUrl, setVideoUrl] = useState('');
  const [tags, setTags] = useState('');
  const [isOriginalCreator, setIsOriginalCreator] = useState(false);
  const [originalChannelName, setOriginalChannelName] = useState('');
  const [originalChannelAvatar, setOriginalChannelAvatar] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      videoUrl,
      tags: tags.split(',').map(tag => tag.trim()),
      isOriginalCreator,
      originalChannelName: !isOriginalCreator ? originalChannelName : null,
      originalChannelAvatar: !isOriginalCreator ? originalChannelAvatar : null
    };

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/posts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        router.push('/');
      } else {
        const errorData = await response.json();
        alert(`Erreur : ${errorData.message}`);
      }
    } catch (error) {
      console.error('Erreur lors de la création du post', error);
      alert('Une erreur est survenue');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto space-y-4">
      <div>
        <label htmlFor="videoUrl" className="block text-sm font-medium text-gray-700">
          URL de la vidéo YouTube
        </label>
        <input
          type="text"
          id="videoUrl"
          value={videoUrl}
          onChange={(e) => setVideoUrl(e.target.value)}
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
        />
      </div>

      <div>
        <label htmlFor="tags" className="block text-sm font-medium text-gray-700">
          Tags (séparés par des virgules)
        </label>
        <input
          type="text"
          id="tags"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
        />
      </div>

      <div className="flex items-center">
        <input
          type="checkbox"
          id="isOriginalCreator"
          checked={isOriginalCreator}
          onChange={(e) => setIsOriginalCreator(e.target.checked)}
          className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
        />
        <label htmlFor="isOriginalCreator" className="ml-2 block text-sm text-gray-900">
          Je suis le créateur de la vidéo
        </label>
      </div>

      {!isOriginalCreator && (
        <>
          <div>
            <label htmlFor="originalChannelName" className="block text-sm font-medium text-gray-700">
              Nom de la chaîne originale
            </label>
            <input
              type="text"
              id="originalChannelName"
              value={originalChannelName}
              onChange={(e) => setOriginalChannelName(e.target.value)}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            />
          </div>

          <div>
            <label htmlFor="originalChannelAvatar" className="block text-sm font-medium text-gray-700">
              URL de l'avatar de la chaîne
            </label>
            <input
              type="text"
              id="originalChannelAvatar"
              value={originalChannelAvatar}
              onChange={(e) => setOriginalChannelAvatar(e.target.value)}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            />
          </div>
        </>
      )}

      <div>
        <button
          type="submit"
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Créer le post
        </button>
      </div>
    </form>
  );
};

export default CreatePostForm; 