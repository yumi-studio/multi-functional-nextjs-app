"use client";

import { Profile } from "@/app/lib/fakebook/definitions";
import { API_FAKEBOOK_PROFILE_CREATE, API_FAKEBOOK_PROFILE_ME, API_FAKEBOOK_PROFILE_SWITCH } from "../api-endpoints";
import BaseService, { Response } from "../base.service";

export type CreateProfileRequest = {
  name: string
}
export type CreateProfileResponse = {
  profileId: string
}

export type GetProfilesResponse = Profile[];

export type GetProfileResponse = Profile;

export type SwitchProfileRequest = {
  id: string
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
}

export const profileService = new ProfileService();
