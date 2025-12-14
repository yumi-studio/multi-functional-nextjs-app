"use client";

import apiClient from "./api-client";

export type Response<T> = {
  success: boolean,
  message: string | null,
  data: T,
  errors: string[]
}

export default class BaseService {
  apiClient;
  constructor() {
    this.apiClient = apiClient;
  }

  async simulateWaiting(milisecond: number = 100): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, milisecond));
    return;
  }
}
