"use client";

import { Profile } from "@/app/lib/fakebook/definitions";
import { API_FAKEBOOK_PROFILE_CREATE, API_FAKEBOOK_PROFILE_ME, API_FAKEBOOK_PROFILE_SWITCH, API_FAKEBOOK_PROFILE_UPDATE_AVATAR } from "../api-endpoints";
import BaseService, { Response } from "../base.service";

type CreateProfileRequest = {
  name: string
}
type CreateProfileResponse = {
  profileId: string
}

type GetProfilesResponse = Profile[];

type GetProfileResponse = Profile;

type SwitchProfileRequest = {
  id: string
}

type UpdateAvatarRequest = {
  file: File
}

class ProfileService extends BaseService {
  constructor() {
    super();
  }

  async getProfiles() {
    const result: Response<GetProfilesResponse> = await this.apiClient.get(API_FAKEBOOK_PROFILE_CREATE);
    return result;
  }

  async createProfile(request: CreateProfileRequest) {
    const result: Response<CreateProfileResponse> = await this.apiClient.post(API_FAKEBOOK_PROFILE_CREATE, request);
    return result;
  }

  async getProfile() {
    const result: Response<GetProfileResponse> = await this.apiClient.get(API_FAKEBOOK_PROFILE_ME);
    return result;
  }

  async switchProfile(request: SwitchProfileRequest) {
    const result: Response<null> = await this.apiClient.get(API_FAKEBOOK_PROFILE_SWITCH + "/" + request.id);
    return result;
  }

  async updateAvatar(request: UpdateAvatarRequest) {
    const formData = new FormData();
    formData.set('file', request.file);
    const result: Response<string> = await this.apiClient.post(API_FAKEBOOK_PROFILE_UPDATE_AVATAR, formData);
    return result;
  }
}

export const profileService = new ProfileService();
