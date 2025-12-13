import { Comment, Post, PostMedia, PostStatistic, PostVisibility, ReactionType, UploadMediaFile } from "@/app/lib/fakebook/definitions";
import BaseService, { Response } from "../base.service";
import { API_FAKEBOOK_POST_COMMENT, API_FAKEBOOK_POST_COMMENT_CREATE, API_FAKEBOOK_POST_CREATE, API_FAKEBOOK_POST_DETAIL, API_FAKEBOOK_POST_LIST, API_FAKEBOOK_POST_REACT, API_FAKEBOOK_POST_STATISTIC, API_FAKEBOOK_POST_UPLOAD_MEDIA } from "../api-endpoints";

export type CreatePostRequest = {
  content: string;
  visibility: PostVisibility;
  mediaItemIds: string[]
}

export type UploadMediaRequest = UploadMediaFile;
export type UploadMediaResponse = {
  fileUploadId: string;
}

class PostsService extends BaseService {
  constructor() {
    super();
  }

  async uploadMedia(request: UploadMediaRequest) {
    const formData = new FormData();
    formData.append('MediaItem', request.file);

    const result: Response<UploadMediaResponse> = await this.apiClient.post(API_FAKEBOOK_POST_UPLOAD_MEDIA, formData, {
      onUploadProgress: (progressEvent) => {
        if (progressEvent.total) {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          console.log(`Uploading ${request.file.name}: ${percentCompleted}%`);
        }
      }
    });

    return result;
  }

  async createPost(request: CreatePostRequest) {
    const result: Response<{ postId: string }> = await this.apiClient.post(API_FAKEBOOK_POST_CREATE, request);
    return result;
  }

  async getAllPosts() {
    const result: Response<Post[]> = await this.apiClient.get(API_FAKEBOOK_POST_LIST);
    return result;
  }

  async getPost(request: { postId: string }) {
    const result: Response<Post | null> = await this.apiClient.get(API_FAKEBOOK_POST_DETAIL.replace("{{id}}", request.postId));
    return result;
  }

  async getPostStatisitic(request: { postId: string }) {
    const result: Response<PostStatistic> = await this.apiClient.get(API_FAKEBOOK_POST_STATISTIC.replace("{{id}}", request.postId));
    return result;
  }

  async reactPost(request: { postId: string, type: ReactionType }) {
    const result: Response<null> = await this.apiClient.post(
      API_FAKEBOOK_POST_REACT.replace("{{id}}", request.postId),
      {
        type: request.type
      }
    );
    return result;
  }

  async getComments(request: { postId: string }) {
    const result: Response<Comment[]> = await this.apiClient.get(API_FAKEBOOK_POST_COMMENT.replace("{{id}}", request.postId));
    return result;
  }

  async getCommentsByPage(request: { postId: string, before: Date | null, limit: number }) {
    const result: Response<{ items: Comment[], next: Date | null }> = await this.apiClient.get(
      API_FAKEBOOK_POST_COMMENT.replace("{{id}}", request.postId),
      {
        params: {
          before: request.before,
          limit: request.limit
        }
      }
    );

    return result;
  }

  async createComment(request: { content: string; postId: string }) {
    const result: Response<{ id: string }> = await this.apiClient.post(API_FAKEBOOK_POST_COMMENT_CREATE.replace("{{id}}", request.postId), {
      content: request.content
    });
    return result;
  }
}

export const postService = new PostsService();
