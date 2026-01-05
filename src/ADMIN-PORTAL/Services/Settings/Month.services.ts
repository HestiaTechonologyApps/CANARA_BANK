// src/ADMIN-PORTAL/Services/Settings/Month.services.ts
import { API_ENDPOINTS } from "../../../CONSTANTS/API_ENDPOINTS";
import HttpService from "../../../Services/HttpService";
import type { CustomResponse } from "../../../Types/ApiTypes";
import type { Month } from "../../Types/Settings/Month.types";

const MonthService = {
 
  async getAllMonths(): Promise<Month[]> {
    const response = await HttpService.callApi<CustomResponse<Month[]>>(
      API_ENDPOINTS.MONTH.GET_ALL,
      "GET"
    );
    return response.value;
  },

  async getMonthById(id: number): Promise<CustomResponse<Month>> {
    const response = await HttpService.callApi<CustomResponse<Month>>(
      API_ENDPOINTS.MONTH.GET_BY_ID(id),
      "GET"
    );
    return response;
  },

  async createMonth(
    data: Omit<Month, "monthCode" | "auditLogs">
  ): Promise<Month> {
    const response = await HttpService.callApi<CustomResponse<Month>>(
      API_ENDPOINTS.MONTH.CREATE,
      "POST",
      data
    );
    return response.value;
  },

  async updateMonth(
    id: number,
    data: Partial<Omit<Month, "monthCode" | "auditLogs">>
  ): Promise<Month> {
    const response = await HttpService.callApi<CustomResponse<Month>>(
      API_ENDPOINTS.MONTH.UPDATE(id),
      "PUT",
      data
    );
    return response.value;
  },

  async deleteMonth(id: number): Promise<void> {
    await HttpService.callApi<CustomResponse<void>>(
      API_ENDPOINTS.MONTH.DELETE(id),
      "DELETE"
    );
  },
};

export default MonthService;