// src/services/UserService.ts
import { API_ENDPOINTS } from "../../../CONSTANTS/API_ENDPOINTS";
import HttpService from "../../../Services/Http.services";
import type { CustomResponse } from "../../../Types/ApiTypes";
import type { ChangePasswordRequest, User } from "../../Types/Settings/User.types";

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
    return response;
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

async changePassword(data: ChangePasswordRequest): Promise<string> {
    const response = await HttpService.callApi<CustomResponse<string>>(
      API_ENDPOINTS.USER.CHANGE_PASSWORD,
      'POST',
      data
    );
    return response.value;
  },

  async getPagedUsers(params: {
    pageNumber: number;
    pageSize: number;
    searchTerm?: string;
    sortBy?: string;
    sortOrder?: "asc" | "desc";
  }): Promise<{ data: User[]; total: number }> {
    const queryParams = new URLSearchParams();
    queryParams.append("PageNumber", String(params.pageNumber));
    queryParams.append("PageSize", String(params.pageSize));
    if (params.searchTerm) queryParams.append("SearchTerm", params.searchTerm);
    if (params.sortBy) queryParams.append("SortBy", params.sortBy);
    if (params.sortOrder) queryParams.append("SortDescending", String(params.sortOrder === "desc"));

    const url = `${API_ENDPOINTS.USER.GET_PAGED}?${queryParams.toString()}`;

    type PagedUserResponse = CustomResponse<{
      data: User[];
      totalRecords: number;
      pageNumber: number;
      pageSize: number;
    }>;

    const response = await HttpService.callApi<PagedUserResponse>(url, "GET");

    return {
      data: response.value.data,
      total: response.value.totalRecords,
    };
  },

  async updateUserPartially(
  id: number,
  data: {
    userId: number;
    typeofUpdate: "username" | "useremail" | "phonenumber";
    userName?: string;
    userEmail?: string;
    phoneNumber?: string;
  }
): Promise<CustomResponse<any>> {
  const response = await HttpService.callApi<CustomResponse<any>>(
    API_ENDPOINTS.USER.UPDATE_PARTIALLY(id),
    "POST",
    data
  );
  return response;
},

};

export default UserService;