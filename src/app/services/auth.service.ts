import { LoginRequest, LoginResponse, RegisterRequest, RegisterResponse } from "../lib/definitions";
import { API_AUTH_EXTERNAL_PROVIDERS, API_AUTH_LOGIN, API_AUTH_LOGOUT, API_AUTH_REGISTER } from "./api-endpoints";
import BaseService, { Response } from "./base.service";

class AuthService extends BaseService {
  constructor() {
    super();
  }

  async login(request: LoginRequest) {
    const result: Response<LoginResponse> = await this.apiClient.post(API_AUTH_LOGIN, request)
    return result;
  }

  async register(request: RegisterRequest) {
    const result: Response<RegisterResponse> = await this.apiClient.post(API_AUTH_REGISTER, request);
    return result;
  }

  async logout() {
    const result: Response<{}> = await this.apiClient.post(API_AUTH_LOGOUT);
    return result;
  }

  async externalProviders() {
    const result: Response<{ [key: string]: string }> = await this.apiClient.get(API_AUTH_EXTERNAL_PROVIDERS);
    return result;
  }
}

export const authService = new AuthService();
