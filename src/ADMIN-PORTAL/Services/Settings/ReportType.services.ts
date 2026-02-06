import { API_ENDPOINTS } from "../../../CONSTANTS/API_ENDPOINTS";
import HttpService from "../../../Services/HttpService";
import type { CustomResponse } from "../../../Types/ApiTypes";
import type { ReportType } from "../../Types/Settings/ReportType.types";


const ReportTypeService = {
  async getAllReportTypes(): Promise<ReportType[]> {
    const response = await HttpService.callApi<CustomResponse<ReportType[]>>(
      API_ENDPOINTS.REPORT_TYPE.GET_ALL,
      "GET"
    );
    return response.value;
  },

  async getReportTypeById(id: number): Promise<CustomResponse<ReportType>> {
    const response = await HttpService.callApi<CustomResponse<ReportType>>(
      API_ENDPOINTS.REPORT_TYPE.GET_BY_ID(id),
      "GET"
    );
    return response;
  },

  // Create (auditLogs excluded)
  async createReportType(
    data: Omit<ReportType, "auditLogs">
  ): Promise<ReportType> {
    const response = await HttpService.callApi<CustomResponse<ReportType>>(
      API_ENDPOINTS.REPORT_TYPE.CREATE,
      "POST",
      data
    );
    return response.value;
  },

  async updateReportType(
    id: number,
    data: Partial<ReportType>
  ): Promise<ReportType> {
    const response = await HttpService.callApi<CustomResponse<ReportType>>(
      API_ENDPOINTS.REPORT_TYPE.UPDATE(id),
      "PUT",
      data
    );
    return response.value;
  },

  async deleteReportType(id: number): Promise<void> {
    await HttpService.callApi<CustomResponse<void>>(
      API_ENDPOINTS.REPORT_TYPE.DELETE(id),
      "DELETE"
    );
  },
};

export default ReportTypeService;
