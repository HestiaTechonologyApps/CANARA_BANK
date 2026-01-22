import { API_ENDPOINTS } from "../../../CONSTANTS/API_ENDPOINTS";
import HttpService from "../../../Services/HttpService";
import type { CustomResponse } from "../../../Types/ApiTypes";
import type { RefundContribution } from "../../Types/Claims/Refund.types";


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
};

export default RefundContributionService;
