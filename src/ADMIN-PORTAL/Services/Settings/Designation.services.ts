// src/services/Settings/Designation.services.ts

import { API_ENDPOINTS } from "../../../CONSTANTS/API_ENDPOINTS";
import HttpService from "../../../Services/HttpService";
import type { CustomResponse } from "../../../Types/ApiTypes";
import type { Designation } from "../../Types/Settings/Designation";

const DesignationService = {
  async getAllDesignations(): Promise<Designation[]> {
    const response = await HttpService.callApi<CustomResponse<Designation[]>>(
      API_ENDPOINTS.DESIGNATION.GET_ALL,
      'GET'
    );
    return response.value;
  },

  async getDesignationById(id: number): Promise<CustomResponse<Designation>> {
    const response = await HttpService.callApi<CustomResponse<Designation>>(
      API_ENDPOINTS.DESIGNATION.GET_BY_ID(id),
      'GET'
    );
    return response;
  },

  async createDesignation(data: Omit<Designation, 'designationId' | 'auditLogs'>): Promise<Designation> {
    const response = await HttpService.callApi<CustomResponse<Designation>>(
      API_ENDPOINTS.DESIGNATION.CREATE,
      'POST',
      data
    );
    return response.value;
  },

  async updateDesignation(id: number, data: Partial<Omit<Designation, 'designationId' | 'auditLogs'>>): Promise<Designation> {
    const response = await HttpService.callApi<CustomResponse<Designation>>(
      API_ENDPOINTS.DESIGNATION.UPDATE(id),
      'PUT',
      data
    );
    return response.value;
  },

  async deleteDesignation(id: number): Promise<void> {
    await HttpService.callApi<CustomResponse<void>>(
      API_ENDPOINTS.DESIGNATION.DELETE(id),
      'DELETE'
    );
  },
};

export default DesignationService;