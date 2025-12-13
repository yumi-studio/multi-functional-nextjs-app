"use client";

import { UserDetail } from "@/app/lib/definitions";
import BaseService, { Response } from "@/app/services/base.service";
import { API_USER_ME } from "./api-endpoints";

class UserService extends BaseService {
  constructor() {
    super();
  }

  async me() {
    const result: Response<UserDetail | null> = await this.apiClient.get(API_USER_ME);
    return result;
  }
}

export const userService = new UserService();
