import { API_ENDPOINTS } from "../../../CONSTANTS/API_ENDPOINTS";
import HttpService from "../../../Services/Http.services";
import type { CustomResponse } from "../../../Types/ApiTypes";
import type { ApproveDeathClaimParams, DeathClaim } from "../../Types/Claims/DeathClaims.type";


const DeathClaimService = {
  async getAllDeathClaims(): Promise<DeathClaim[]> {
    const response = await HttpService.callApi<CustomResponse<DeathClaim[]>>(
      API_ENDPOINTS.DEATH_CLAIMS.GET_ALL,
      "GET"
    );
    return response.value;
  },

  async getDeathClaimById(id: number): Promise<CustomResponse<DeathClaim>> {
    const response = await HttpService.callApi<CustomResponse<DeathClaim>>(
      API_ENDPOINTS.DEATH_CLAIMS.GET_BY_ID(id),
      "GET"
    );
    
    return response;
  },

  async createDeathClaim(
    data: Omit<DeathClaim, "deathClaimId">
  ): Promise<DeathClaim> {
    const response = await HttpService.callApi<CustomResponse<DeathClaim>>(
      API_ENDPOINTS.DEATH_CLAIMS.CREATE,
      "POST",
      data
    );
    return response.value;
  },

  async updateDeathClaim(
    id: number,
    data: Partial<Omit<DeathClaim, "deathClaimId">>
  ): Promise<DeathClaim> {
    const response = await HttpService.callApi<CustomResponse<DeathClaim>>(
      API_ENDPOINTS.DEATH_CLAIMS.UPDATE(id),
      "PUT",
      data
    );
    return response.value;
  },

async deleteDeathClaim(id: number): Promise<void> {
    await HttpService.callApi<CustomResponse<void>>(
      API_ENDPOINTS.DEATH_CLAIMS.DELETE(id),
      "DELETE"
    );
  },

   async approveDeathClaim(
    id: number,
    params: ApproveDeathClaimParams
  ): Promise<DeathClaim> {
    const url = `${API_ENDPOINTS.DEATH_CLAIMS.UPDATE_BY_APPROVE(id)}?approve=${params.approve}&currentUserId=${params.currentUserId}`;
    const response = await HttpService.callApi<CustomResponse<DeathClaim>>(url, "PUT");
    return response.value;
  },

  async getPagedDeathClaims(params: {
    pageNumber: number;
    pageSize: number;
    searchTerm?: string;
    sortBy?: string;
    sortOrder?: "asc" | "desc";
  }): Promise<{ data: DeathClaim[]; total: number }> {
    const queryParams = new URLSearchParams();
    queryParams.append("PageNumber", String(params.pageNumber));
    queryParams.append("PageSize", String(params.pageSize));
    if (params.searchTerm) queryParams.append("SearchTerm", params.searchTerm);
    if (params.sortBy) queryParams.append("SortBy", params.sortBy);
    if (params.sortOrder) queryParams.append("SortDescending", String(params.sortOrder === "desc"));

    const url = `${API_ENDPOINTS.DEATH_CLAIMS.GET_PAGED}?${queryParams.toString()}`;

    type PagedDeathClaimResponse = CustomResponse<{
      data: DeathClaim[];
      totalRecords: number;
      pageNumber: number;
      pageSize: number;
    }>;

    const response = await HttpService.callApi<PagedDeathClaimResponse>(url, "GET");

    return {
      data: response.value.data,
      total: response.value.totalRecords,
    };
  },
};

export default DeathClaimService;
