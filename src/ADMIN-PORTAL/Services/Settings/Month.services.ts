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
    
    // ✅ CHECK IF API RETURNED ERROR (duplicate case)
    if (!response.isSucess) {
      throw new Error(response.error || "Failed to create month");
    }
    
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
    
    // ✅ CHECK IF API RETURNED ERROR (duplicate case)
    if (!response.isSucess) {
      throw new Error(response.error || "Failed to update month");
    }
    
    return response.value;
  },

  async deleteMonth(id: number): Promise<void> {
    const response = await HttpService.callApi<CustomResponse<void>>(
      API_ENDPOINTS.MONTH.DELETE(id),
      "DELETE"
    );
    
    // ✅ CHECK IF API RETURNED ERROR
    if (!response.isSucess) {
      throw new Error(response.error || "Failed to delete month");
    }
  },
};

export default MonthService;