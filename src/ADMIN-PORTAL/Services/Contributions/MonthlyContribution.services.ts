import { API_ENDPOINTS } from "../../../CONSTANTS/API_ENDPOINTS";
import HttpService from "../../../Services/HttpService";
import type { CustomResponse } from "../../../Types/ApiTypes";
import type { MonthlyContribution } from "../../Types/Contributions/MonthlyContribution.types";

const MonthlyContributionService = {

  async getAllMonthlyContributions(): Promise<MonthlyContribution[]> {
    const response = await HttpService.callApi<CustomResponse<MonthlyContribution[]>>(
      API_ENDPOINTS.MONTHLY_CONTRIBUTION.GET_ALL,
      "GET"
    );
    return response.value;
  },

  async getMonthlyContributionById(id: number): Promise<CustomResponse<MonthlyContribution>> {
    const response = await HttpService.callApi<CustomResponse<MonthlyContribution>>(
      API_ENDPOINTS.MONTHLY_CONTRIBUTION.GET_BY_ID(id),
      "GET"
    );
    return response;
  },

  async createMonthlyContribution(
    data: Omit<MonthlyContribution, "monthlyContributionId" | "auditLogs">
  ): Promise<MonthlyContribution> {
    const response = await HttpService.callApi<CustomResponse<MonthlyContribution>>(
      API_ENDPOINTS.MONTHLY_CONTRIBUTION.CREATE,
      "POST",
      data
    );
    return response.value;
  },

  async updateMonthlyContribution(
    id: number,
    data: Partial<Omit<MonthlyContribution, "monthlyContributionId" | "auditLogs">>
  ): Promise<MonthlyContribution> {
    const response = await HttpService.callApi<CustomResponse<MonthlyContribution>>(
      API_ENDPOINTS.MONTHLY_CONTRIBUTION.UPDATE(id),
      "PUT",
      data
    );
    return response.value;
  },

  async deleteMonthlyContribution(id: number): Promise<void> {
    await HttpService.callApi<CustomResponse<void>>(
      API_ENDPOINTS.MONTHLY_CONTRIBUTION.DELETE(id),
      "DELETE"
    );
  },

  // ✅ File Upload (same pattern as Member profile upload)
  async uploadFile(file: File, monthlyContributionId: number): Promise<string> {
    const formData = new FormData();
    formData.append("MonthlyContributionId", monthlyContributionId.toString());
    formData.append("File", file);

    const response = await fetch(API_ENDPOINTS.MONTHLY_CONTRIBUTION.UPLOAD_FILE, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      const err = await response.text();
      throw new Error(err || "File upload failed");
    }

    const result = await response.json();
    return result.value || result.filePath || "";
  },
};

export default MonthlyContributionService;
