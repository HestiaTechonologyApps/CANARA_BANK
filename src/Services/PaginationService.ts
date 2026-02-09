// src/Services/PaginationService.ts
import type { CustomResponse } from "../Types/ApiTypes";
import HttpService from "./HttpService";

export interface PaginationParams {
  pageNumber?: number;
  pageSize?: number;
  searchTerm?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface PaginatedResult<T> {
  data: T[];
  total: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  totalRecords: number;
  pageNumber: number;
  pageSize: number;
  totalPages: number;
  hasPrevious: boolean;
  hasNext: boolean;
}

/**
 * Generic pagination service
 * Use this for any entity that has a /paged endpoint
 */
export const createPaginatedService = <T>(baseEndpoint: string) => {
  return async (params: PaginationParams): Promise<PaginatedResult<T>> => {
    try {
      const {
        pageNumber = 1,
        pageSize = 10,
        searchTerm = '',
        sortBy = '',
        sortOrder = 'asc'
      } = params;

      const queryParams = new URLSearchParams({
        PageNumber: pageNumber.toString(),
        PageSize: pageSize.toString(),
      });

      if (searchTerm?.trim()) {
        queryParams.append('SearchTerm', searchTerm.trim());
      }
      
      if (sortBy?.trim()) {
        queryParams.append('SortBy', sortBy.trim());
        queryParams.append('SortDescending', (sortOrder === 'desc').toString());
      }

      const url = `${baseEndpoint}?${queryParams.toString()}`;

      console.log('🔍 Fetching paginated data:', url);

      const response = await HttpService.callApi<CustomResponse<PaginatedResponse<T>>>(
        url,
        "GET"
      );

      console.log('📥 Pagination response:', response);

      if (!response?.value) {
        console.error('❌ Invalid response structure');
        return { data: [], total: 0 };
      }

      return {
        data: response.value.data || [],
        total: response.value.totalRecords || 0
      };

    } catch (error) {
      console.error('❌ Pagination error:', error);
      return { data: [], total: 0 };
    }
  };
};