export interface Post {
  _id: string;
  title: string;
  videoUrl: string;
  youtubeId: string;
  creator: {
    _id: string;
    username: string;
    avatar: string;
  };
  isCreator: boolean;
  thumbnailUrl: string;
  description?: string;
  upvotes: string[];
  upvoteCount: number;
  youtubeChannel: {
    name: string;
    avatar: string;
  };
  comments?: Array<{
    _id: string;
    content: string;
    author: {
      _id: string;
      username: string;
      avatar: string;
    };
    createdAt: string;
  }>;
  tags: string[];
  createdAt: string;
  updatedAt?: string;
} 