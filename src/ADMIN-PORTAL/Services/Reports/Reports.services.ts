import { API_ENDPOINTS } from "../../../CONSTANTS/API_ENDPOINTS";
import HttpService from "../../../Services/HttpService";
import type { CustomResponse } from "../../../Types/ApiTypes";
import type { Reports } from "../../Types/Reports/Reports.types";

const ReportService = {
  async getAllReports(): Promise<Reports[]> {
    const response = await HttpService.callApi<CustomResponse<Reports[]>>(
      API_ENDPOINTS.REPORTS.GET_ALL,
      "GET"
    );
    return response.value;
  },

  async getReportById(id: number): Promise<CustomResponse<Reports>> {
    const response = await HttpService.callApi<CustomResponse<Reports>>(
      API_ENDPOINTS.REPORTS.GET_BY_ID(id),
      "GET"
    );
    return response;
  },

  async createReport(
    data: Omit<Reports, "auditLogs">
  ): Promise<Reports> {
    const response = await HttpService.callApi<CustomResponse<Reports>>(
      API_ENDPOINTS.REPORTS.CREATE,
      "POST",
      data
    );
    return response.value;
  },

  async updateReport(
    id: number,
    data: Partial<Reports>
  ): Promise<Reports> {
    const response = await HttpService.callApi<CustomResponse<Reports>>(
      API_ENDPOINTS.REPORTS.UPDATE(id),
      "PUT",
      data
    );
    return response.value;
  },

  async deleteReport(id: number): Promise<void> {
    await HttpService.callApi<CustomResponse<void>>(
      API_ENDPOINTS.REPORTS.DELETE(id),
      "DELETE"
    );
  },
};

export default ReportService;
