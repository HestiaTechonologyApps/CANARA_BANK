// src/services/UserTypeService.ts
import { API_ENDPOINTS } from "../../../CONSTANTS/API_ENDPOINTS";
import HttpService from "../../../Services/HttpService";
import type { CustomResponse } from "../../../Types/ApiTypes";
import type { UserType } from "../../Types/Settings/UserType.types";


const UserTypeService = {
  async getAllUserTypes(): Promise<UserType[]> {
    const response = await HttpService.callApi<CustomResponse<UserType[]>>(
      API_ENDPOINTS.USER_TYPE.GET_ALL,
      "GET"
    );
    return response.value;
  },

  async getUserTypeById(id: number): Promise<CustomResponse<UserType>> {
    const response = await HttpService.callApi<CustomResponse<UserType>>(
      API_ENDPOINTS.USER_TYPE.GET_BY_ID(id),
      "GET"
    );
    return response;
  },

  async createUserType(
    data: Omit<UserType, "userTypeId" | "auditLogs">
  ): Promise<UserType> {
    const response = await HttpService.callApi<CustomResponse<UserType>>(
      API_ENDPOINTS.USER_TYPE.CREATE,
      "POST",
      data
    );
    return response.value;
  },

  async updateUserType(
    id: number,
    data: Partial<Omit<UserType, "userTypeId" | "auditLogs">>
  ): Promise<UserType> {
    const response = await HttpService.callApi<CustomResponse<UserType>>(
      API_ENDPOINTS.USER_TYPE.UPDATE(id),
      "PUT",
      data
    );
    return response.value;
  },

  async deleteUserType(id: number): Promise<void> {
    await HttpService.callApi<CustomResponse<void>>(
      API_ENDPOINTS.USER_TYPE.DELETE(id),
      "DELETE"
    );
  },
};

export default UserTypeService;
