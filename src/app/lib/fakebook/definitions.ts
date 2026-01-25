export type Profile = {
  id: string,
  name: string,
  avatarUrl: string | null,
}

export type ReactionType = 0 | 1 | 2;

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
  creator: Profile,
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
  creator: Profile;
  createdAt: string;
  statistic: PostStatistic;
  reaction: ReactionType | null;
}

export type UploadMediaStatus = 'pending' | 'uploading' | 'done' | 'error';
export type UploadMediaFile = {
  file: File;
  preview_url: string;
  type: PostMediaType;
  status: UploadMediaStatus;
}
