import { API_ENDPOINTS } from "../../../CONSTANTS/API_ENDPOINTS";
import HttpService from "../../../Services/Http.services";
import type { CustomResponse } from "../../../Types/ApiTypes";
import type { UserRoleRight } from "../../Types/Settings/UserRoleRight.types";

const UserRoleRightService = {
  async getAllUserRoleRights(): Promise<UserRoleRight[]> {
    const response = await HttpService.callApi<CustomResponse<UserRoleRight[]>>(
      API_ENDPOINTS.USER_ROLE_RIGHT.GET_ALL,
      "GET"
    );
    return response.value;
  },

  async getUserRoleRightById(id: number): Promise<CustomResponse<UserRoleRight>> {
    const response = await HttpService.callApi<CustomResponse<UserRoleRight>>(
      API_ENDPOINTS.USER_ROLE_RIGHT.GET_BY_ID(id),
      "GET"
    );
    return response;
  },

  async createUserRoleRight(
    data: Omit<UserRoleRight, "userRoleRightId" | "auditLogs">
  ): Promise<UserRoleRight> {
    const response = await HttpService.callApi<CustomResponse<UserRoleRight>>(
      API_ENDPOINTS.USER_ROLE_RIGHT.CREATE,
      "POST",
      data
    );
    return response.value;
  },

  async updateUserRoleRight(
    id: number,
    data: Partial<Omit<UserRoleRight, "userRoleRightId" | "auditLogs">>
  ): Promise<UserRoleRight> {
    const response = await HttpService.callApi<CustomResponse<UserRoleRight>>(
      API_ENDPOINTS.USER_ROLE_RIGHT.UPDATE(id),
      "PUT",
      data
    );
    return response.value;
  },

  async deleteUserRoleRight(id: number): Promise<void> {
    await HttpService.callApi<CustomResponse<void>>(
      API_ENDPOINTS.USER_ROLE_RIGHT.DELETE(id),
      "DELETE"
    );
  },
};

export default UserRoleRightService;
