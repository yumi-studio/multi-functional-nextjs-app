import { Comment, CommentStatistic, ReactionType } from "@/app/lib/fakebook/definitions";
import { API_FAKEBOOK_COMMENT_DELETE, API_FAKEBOOK_COMMENT_DETAIL, API_FAKEBOOK_COMMENT_REACT, API_FAKEBOOK_COMMENT_STATISTIC, API_FAKEBOOK_COMMENT_UPDATE, API_FAKEBOOK_POST_COMMENT_CREATE } from "../api-endpoints";
import BaseService, { Response } from "../base.service";

class CommentService extends BaseService {
  constructor() {
    super();
  }

  async getComment(request: { id: string; }) {
    const result: Response<Comment> = await this.apiClient.get(API_FAKEBOOK_COMMENT_DETAIL.replace("{{id}}", request.id));
    return result;
  }

  async deleteComment(request: { id: string }) {
    const result: Response<null> = await this.apiClient.delete(API_FAKEBOOK_COMMENT_DELETE.replace("{{id}}", request.id));
    return result;
  }

  async updateComment(request: { id: string, content: string }) {
    const result: Response<Comment> = await this.apiClient.put(API_FAKEBOOK_COMMENT_UPDATE.replace("{{id}}", request.id), {
      content: request.content
    });
    return result;
  }

  async reactComment(request: { id: string, type: ReactionType }) {
    const result: Response<null> = await this.apiClient.post(API_FAKEBOOK_COMMENT_REACT.replace("{{id}}", request.id), {
        type: request.type
    });
    return result;
  }

  async getStatistic(request: { id: string }) {
    const result: Response<CommentStatistic> = await this.apiClient.get(API_FAKEBOOK_COMMENT_STATISTIC.replace("{{id}}", request.id));
    return result;
  }
}

export const commentService = new CommentService();
