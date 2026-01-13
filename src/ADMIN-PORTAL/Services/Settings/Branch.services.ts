

import { API_ENDPOINTS } from "../../../CONSTANTS/API_ENDPOINTS";
import HttpService from "../../../Services/HttpService";
import type { CustomResponse } from "../../../Types/ApiTypes";
import type { Branch } from "../../Types/Settings/Branch.types";

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
};

export default BranchService;
