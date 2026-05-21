// src/services/Settings/YearMaster.services.ts

import { API_ENDPOINTS } from "../../../CONSTANTS/API_ENDPOINTS";
import HttpService from "../../../Services/Http.services";
import type { CustomResponse } from "../../../Types/ApiTypes";
import type { YearMaster } from "../../Types/Settings/YearMaster.types";

const YearMasterService = {
  // Get all Year Masters
  async getAllYearMasters(): Promise<YearMaster[]> {
    const response = await HttpService.callApi<CustomResponse<YearMaster[]>>(
      API_ENDPOINTS.YEAR_MASTER.GET_ALL,
      "GET"
    );
    return response.value;
  },

  
  async getYearMasterById(id: number): Promise<CustomResponse<YearMaster>> {
    const response = await HttpService.callApi<CustomResponse<YearMaster>>(
      API_ENDPOINTS.YEAR_MASTER.GET_BY_ID(id),
      "GET"
    );
    
    return response;
  },

  
  async createYearMaster(
    data: Omit<YearMaster, "auditLogs">
  ): Promise<YearMaster> {
    const response = await HttpService.callApi<CustomResponse<YearMaster>>(
      API_ENDPOINTS.YEAR_MASTER.CREATE,
      "POST",
      data
    );
    
    
    if (!response.isSucess) {
      throw new Error(response.error || "Failed to create year");
    }
    
    return response.value;
  },

  
  async updateYearMaster(
    id: number,
    data: Partial<Omit<YearMaster, "auditLogs">>
  ): Promise<YearMaster> {
    const response = await HttpService.callApi<CustomResponse<YearMaster>>(
      API_ENDPOINTS.YEAR_MASTER.UPDATE(id),
      "PUT",
      data
    );
    
    
    if (!response.isSucess) {
      throw new Error(response.error || "Failed to update year");
    }
    
    return response.value;
  },

  
  async deleteYearMaster(id: number): Promise<void> {
    const response = await HttpService.callApi<CustomResponse<void>>(
      API_ENDPOINTS.YEAR_MASTER.DELETE(id),
      "DELETE"
    );
    
    
    if (!response.isSucess) {
      throw new Error(response.error || "Failed to delete year");
    }
  },
};

export default YearMasterService;