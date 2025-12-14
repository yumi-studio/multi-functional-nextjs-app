export type User = {
  id: number;
  displayName: string;
  avatarUrl: string;
  jobTitle?: string;
  verified?: boolean;
}

export type Profile = {
  id: string,
  name: string,
  avatarUrl: string,
}

export type ReactionType = 0 | 1 | 2;

export type Reaction = {
  userId: string;
  type: "upvote" | "downvote";
};


export type CommentStatistic = {
  reactions: {
    upvote: number,
    downvote: number,
  }
  replies: number,
}
export type Comment = {
  id: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  creator: {
    id: string;
    name: string;
    avatarUrl: string;
  },
  statistic: CommentStatistic;
  reaction: ReactionType | null
};

export type PostMediaType = 'image' | 'video' | 'audio' | 'file';
export type PostMedia = {
  id: string;
  name: string;
  type: PostMediaType;
  path: string;
  source: string;
}
export type PostVisibility = 1 | 2 | 3;
export const PostVisibilityText = {
  1: "Public",
  2: "Friend",
  3: "Only Me"
}
export type PostOwner = {
  id: string;
  name: string;
  avatar_url: string;
  is_verified?: boolean;
};

export type PostStatistic = {
  reactions: {
    upvote: number,
    downvote: number,
  }
  comment: number,
  share: number
}

export type Post = {
  id: string;
  content?: string;
  visibility?: PostVisibility;
  mediaItems?: PostMedia[];
  creator: {
    id: string,
    name: string,
    avatarUrl: string
  };
  createdAt: string;
  statistic: PostStatistic;
  reaction: ReactionType | null;

  // Not sure used
  // reactions?: Reaction[];
  // comments?: Comment[];
  // shareCount?: number;
  // privacy: 'public' | 'friends' | 'private';
  // isShared?: boolean;
  // sharedFrom?: Post;
}


// Definitions for Post Upload
export type UploadMediaStatus = 'pending' | 'uploading' | 'done' | 'error';
export type UploadMediaFile = {
  file: File;
  preview_url: string;
  type: PostMediaType;
  status: UploadMediaStatus;
}

export type PostCreatePayload = {
  content: string;
  visibility: PostVisibility;
  media_item_ids: [string]; // Array of uploaded media item IDs
}
export type PostCreateResponse = {
  post_id: string;
  post: Post;
}

export type PostUploadMediaPayload = {
  file: UploadMediaFile;
}
export type PostUploadMediaResponse = {
  media_item_id: string;
}
