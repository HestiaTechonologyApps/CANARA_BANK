import { API_ENDPOINTS } from "../../../CONSTANTS/API_ENDPOINTS";
import HttpService from "../../../Services/Http.services";
import type { CustomResponse } from "../../../Types/ApiTypes";
import type { Branch, CircleByState } from "../../Types/Settings/Branch.types";

const BranchService = {
  async getAllBranches(): Promise<Branch[]> {
    const response = await HttpService.callApi<CustomResponse<Branch[]>>(
      API_ENDPOINTS.BRANCH.GET_ALL,
      "GET"
    );
    return response.value;
  },

  async getBranchById(id: number): Promise<CustomResponse<Branch>> {
    const response = await HttpService.callApi<CustomResponse<Branch>>(
      API_ENDPOINTS.BRANCH.GET_BY_ID(id),
      "GET"
    );
    return response;
  },

  async createBranch(
    data: Omit<Branch, "branchId" | "auditLogs">
  ): Promise<Branch> {
    const response = await HttpService.callApi<CustomResponse<Branch>>(
      API_ENDPOINTS.BRANCH.CREATE,
      "POST",
      data
    );
    return response.value;
  },

  async updateBranch(
    id: number,
    data: Omit<Branch, "branchId" | "auditLogs">
  ): Promise<Branch> {
    const response = await HttpService.callApi<CustomResponse<Branch>>(
      API_ENDPOINTS.BRANCH.UPDATE(id),
      "PUT",
      data
    );
    return response.value;
  },

  async deleteBranch(id: number): Promise<void> {
    await HttpService.callApi<CustomResponse<void>>(
      API_ENDPOINTS.BRANCH.DELETE(id),
      "DELETE"
    );
  },

  async getCirclesByStateId(stateId: number): Promise<CircleByState[]> {
    const response = await HttpService.callApi<CustomResponse<CircleByState[]>>(
      API_ENDPOINTS.BRANCH.GET_BY_STATE_ID(stateId),
      "GET"
    );
    return response.value;
  },

  async getPagedBranches(params: {
    pageNumber: number;
    pageSize: number;
    searchTerm?: string;
    sortBy?: string;
    sortOrder?: "asc" | "desc";
  }): Promise<{ data: Branch[]; total: number }> {
    const queryParams = new URLSearchParams();
    queryParams.append("PageNumber", String(params.pageNumber));
    queryParams.append("PageSize", String(params.pageSize));
    if (params.searchTerm) queryParams.append("SearchTerm", params.searchTerm);
    if (params.sortBy) queryParams.append("SortBy", params.sortBy);
    if (params.sortOrder) queryParams.append("SortDescending", String(params.sortOrder === "desc"));

    const url = `${API_ENDPOINTS.BRANCH.GET_PAGED}?${queryParams.toString()}`;

    type PagedBranchResponse = CustomResponse<{
      data: Branch[];
      totalRecords: number;
      pageNumber: number;
      pageSize: number;
    }>;

    const response = await HttpService.callApi<PagedBranchResponse>(url, "GET");

    return {
      data: response.value.data,
      total: response.value.totalRecords,
    };
  },
};

export default BranchService;