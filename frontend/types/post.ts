export interface Post {
  _id: string;
  title: string;
  description: string;
  videoUrl: string;
  thumbnailUrl?: string;
  creator: {
    _id: string;
    username: string;
    avatar: string;
  };
  tags: string[];
  upvotes: string[];
  upvoteCount: number;
  commentCount: number;
  createdAt: string;
} 