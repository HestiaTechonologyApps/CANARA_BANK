import { API_ENDPOINTS } from "../../../CONSTANTS/API_ENDPOINTS";
import HttpService from "../../../Services/Http.services";
import type { CustomResponse } from "../../../Types/ApiTypes";
import type { ApproveRefundContributionParams, MemberRefundEligibility, RefundContribution } from "../../Types/Claims/Refund.types";

const RefundContributionService = {
  async getAllRefundContributions(): Promise<RefundContribution[]> {
    const response = await HttpService.callApi<CustomResponse<RefundContribution[]>>(
      API_ENDPOINTS.REFUND_CONTRIBUTION.GET_ALL,
      "GET"
    );
    return response.value;
  },

  async getRefundContributionById(id: number): Promise<CustomResponse<RefundContribution>> {
    const response = await HttpService.callApi<CustomResponse<RefundContribution>>(
      API_ENDPOINTS.REFUND_CONTRIBUTION.GET_BY_ID(id),
      "GET"
    );
    return response;
  },

  async createRefundContribution(
    data: Omit<RefundContribution, "refundContributionId" | "auditLogs">
  ): Promise<RefundContribution> {
    const response = await HttpService.callApi<CustomResponse<RefundContribution>>(
      API_ENDPOINTS.REFUND_CONTRIBUTION.CREATE,
      "POST",
      data
    );
    return response.value;
  },

  async updateRefundContribution(
    id: number,
    data: Partial<Omit<RefundContribution, "refundContributionId" | "auditLogs">>
  ): Promise<RefundContribution> {
    const response = await HttpService.callApi<CustomResponse<RefundContribution>>(
      API_ENDPOINTS.REFUND_CONTRIBUTION.UPDATE(id),
      "PUT",
      data
    );
    return response.value;
  },

async deleteRefundContribution(id: number): Promise<void> {
    await HttpService.callApi<CustomResponse<void>>(
      API_ENDPOINTS.REFUND_CONTRIBUTION.DELETE(id),
      "DELETE"
    );
  },

   async getRefundContributionByMemberId(
    memberId: number
  ): Promise<CustomResponse<RefundContribution[]>> {
    const response = await HttpService.callApi<CustomResponse<RefundContribution[]>>(
      API_ENDPOINTS.REFUND_CONTRIBUTION.GET_BY_MEMBER_ID(memberId),
      "GET"
    );
    return response;
  },

 async approveRefundContribution(
    id: number,
    params: ApproveRefundContributionParams
  ): Promise<RefundContribution> {
    const url = `${API_ENDPOINTS.REFUND_CONTRIBUTION.UPDATE_BY_APPROVE(id)}?approve=${params.approve}&currentUserId=${params.currentUserId}`;
    const response = await HttpService.callApi<CustomResponse<RefundContribution>>(url, "PUT");
    return response.value;
  },

  async getPagedRefundContributions(params: {
    pageNumber: number;
    pageSize: number;
    searchTerm?: string;
    sortBy?: string;
    sortOrder?: "asc" | "desc";
  }): Promise<{ data: RefundContribution[]; total: number }> {
    const isAll = params.pageSize === -1;
    const queryParams = new URLSearchParams();
    queryParams.append("PageNumber", String(params.pageNumber));
    queryParams.append("PageSize", String(isAll ? 1 : params.pageSize));
    if (isAll) queryParams.append("GetAll", "true");
    if (params.searchTerm) queryParams.append("SearchTerm", params.searchTerm);
    if (params.sortBy) queryParams.append("SortBy", params.sortBy);
    if (params.sortOrder) queryParams.append("SortDescending", String(params.sortOrder === "desc"));

    const url = `${API_ENDPOINTS.REFUND_CONTRIBUTION.GET_PAGED}?${queryParams.toString()}`;

    type PagedRefundContributionResponse = CustomResponse<{
      data: RefundContribution[];
      totalRecords: number;
      pageNumber: number;
      pageSize: number;
    }>;

    const response = await HttpService.callApi<PagedRefundContributionResponse>(url, "GET");

    return {
      data: response.value.data,
      total: response.value.totalRecords,
    };
  },

  async getMemberEligibility(
  memberId: number,
  excludeRefundContributionId?: number
): Promise<CustomResponse<MemberRefundEligibility>> {
  const response = await HttpService.callApi<CustomResponse<MemberRefundEligibility>>(
    API_ENDPOINTS.REFUND_CONTRIBUTION.GET_MEMBER_ELIGIBILITY(memberId, excludeRefundContributionId),
    "GET"
  );
  return response;
},
};

export default RefundContributionService;
