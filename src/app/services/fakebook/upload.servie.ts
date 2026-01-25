import { UploadMediaFile } from "@/app/lib/fakebook/definitions";
import BaseService, { Response } from "../base.service";
import { API_FAKEBOOK_UPLOADFILE } from "../api-endpoints";

export type UploadMediaRequest = UploadMediaFile;
export type UploadMediaResponse = {
  name: string;
  contentType: string;
  path: string;
  url: string;
  size: number;
  dimension: {
    width: number;
    height: number;
  }
}

class UploadService extends BaseService {
  constructor() {
    super();
  }

  async uploadMedia(request: UploadMediaRequest) {
    const formData = new FormData();
    formData.append('file', request.file);

    const result: Response<UploadMediaResponse> = await this.apiClient.post(API_FAKEBOOK_UPLOADFILE, formData, {
      onUploadProgress: (progressEvent) => {
        if (progressEvent.total) {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          console.log(`Uploading ${request.file.name}: ${percentCompleted}%`);
        }
      }
    });

    return result;
  }
}

export const uploadService = new UploadService();
