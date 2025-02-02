import React from 'react';

interface TagListProps {
  tags: string[];
}

export default function TagList({ tags }: TagListProps) {
  if (!tags || tags.length === 0) return null;

  return (
    <div className="flex overflow-x-auto space-x-2 mt-2 pb-2">
      {tags.map((tag, index) => (
        <span 
          key={index} 
          className="px-3 py-1 text-xs text-gray-600 bg-gray-100 border border-gray-200 rounded-full"
        >
          {tag}
        </span>
      ))}
    </div>
  );
} 