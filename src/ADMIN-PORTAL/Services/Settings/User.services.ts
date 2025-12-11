// src/services/UserService.ts
import { API_ENDPOINTS } from "../../../CONSTANTS/API_ENDPOINTS";
import HttpService from "../../../Services/HttpService";
import type { CustomResponse } from "../../../Types/ApiTypes";
import type { User } from "../../Types/Settings/User.types";

const UserService = {
  async getAllUsers(): Promise<User[]> {
    const response = await HttpService.callApi<CustomResponse<User[]>>(
      API_ENDPOINTS.USER.GET_ALL,
      'GET'
    );
    return response.value;
  },

  async getUserById(id: number): Promise<CustomResponse<User>> {
    const response = await HttpService.callApi<CustomResponse<User>>(
      API_ENDPOINTS.USER.GET_BY_ID(id),
      'GET'
    );
    return response; // Return full response, not just value
  },

  async createUser(data: Omit<User, 'userId' | 'auditLogs'>): Promise<User> {
    const response = await HttpService.callApi<CustomResponse<User>>(
      API_ENDPOINTS.USER.CREATE,
      'POST',
      data
    );
    return response.value;
  },

  async updateUser(id: number, data: Partial<Omit<User, 'userId' | 'auditLogs'>>): Promise<User> {
    const response = await HttpService.callApi<CustomResponse<User>>(
      API_ENDPOINTS.USER.UPDATE(id),
      'PUT',
      data
    );
    return response.value;
  },

  async deleteUser(id: number): Promise<void> {
    await HttpService.callApi<CustomResponse<void>>(
      API_ENDPOINTS.USER.DELETE(id),
      'DELETE'
    );
  },

  async changePassword(data: { userId: number; oldPassword: string; newPassword: string }): Promise<void> {
    await HttpService.callApi<CustomResponse<void>>(
      API_ENDPOINTS.USER.CHANGE_PASSWORD,
      'POST',
      data
    );
  },
};

export default UserService;