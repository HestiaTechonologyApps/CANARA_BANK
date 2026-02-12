// src/services/Settings/Designation.services.ts

import { API_ENDPOINTS } from "../../../CONSTANTS/API_ENDPOINTS";
import HttpService from "../../../Services/HttpService";
import type { CustomResponse } from "../../../Types/ApiTypes";
import type { 
  Designation, 
  DesignationPaginationParams, 
  PagedDesignationResult 
} from "../../Types/Settings/Designation";

const DesignationService = {
  async getAllDesignations(): Promise<Designation[]> {
    const response = await HttpService.callApi<CustomResponse<Designation[]>>(
      API_ENDPOINTS.DESIGNATION.GET_ALL,
      'GET'
    );
    return response.value;
  },

  // NEW: Paginated service method
  async getPagedDesignations(params: {
    pageNumber: number;
    pageSize: number;
    searchTerm?: string;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  }): Promise<{ data: Designation[]; total: number }> {
    const paginationParams: DesignationPaginationParams = {
      pageNumber: params.pageNumber,
      pageSize: params.pageSize,
      searchTerm: params.searchTerm || '',
      sortBy: params.sortBy || 'DesignationId',
      sortDescending: params.sortOrder === 'desc',
    };

    const response = await HttpService.callApi<CustomResponse<PagedDesignationResult>>(
      API_ENDPOINTS.DESIGNATION.GET_PAGINATED,
      'POST',
      paginationParams
    );

    return {
      data: response.value.data,
      total: response.value.totalRecords,
    };
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