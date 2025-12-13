"use client";

import axios, { HttpStatusCode } from "axios";

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_HOST,
  withCredentials: true,
  validateStatus: function (status) {
    return true;
  },
});

export default apiClient;
