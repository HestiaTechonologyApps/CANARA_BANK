import { API_ENDPOINTS } from "../../../CONSTANTS/API_ENDPOINTS";
import HttpService from "../../../Services/Http.services";
import type { CustomResponse } from "../../../Types/ApiTypes";
import type { UserRegistrationDetail, UserRegistrationListItem } from "../../Types/UserRegistration/UserRegistration.types";


const UserRegistrationService = {
  async getPending(): Promise<UserRegistrationListItem[]> {
    const response = await HttpService.callApi<CustomResponse<UserRegistrationListItem[]>>(
      API_ENDPOINTS.USER_REGISTRATION.GET_PENDING,
      "GET"
    );
    return response.value ?? [];
  },

  async getAll(): Promise<UserRegistrationListItem[]> {
    const response = await HttpService.callApi<CustomResponse<UserRegistrationListItem[]>>(
      API_ENDPOINTS.USER_REGISTRATION.GET_ALL,
      "GET"
    );
    return response.value ?? [];
  },

  async getById(id: number): Promise<UserRegistrationDetail | null> {
    const response = await HttpService.callApi<CustomResponse<UserRegistrationDetail>>(
      API_ENDPOINTS.USER_REGISTRATION.GET_BY_ID(id),
      "GET"
    );
    return response.value ?? null;
  },

  async approve(id: number, currentUserId: number): Promise<CustomResponse<string>> {
    return await HttpService.callApi<CustomResponse<string>>(
      API_ENDPOINTS.USER_REGISTRATION.APPROVE(id, true, currentUserId),
      "POST"
    );
  },

  async reject(id: number, currentUserId: number, rejectReason: string): Promise<CustomResponse<string>> {
    return await HttpService.callApi<CustomResponse<string>>(
      API_ENDPOINTS.USER_REGISTRATION.APPROVE(id, false, currentUserId, rejectReason),
      "POST"
    );
  },
};

export default UserRegistrationService;