// src/services/ReportEngineService.ts

import { API_ENDPOINTS } from "../../../CONSTANTS/API_ENDPOINTS";
import HttpService from "../../../Services/HttpService";
import type { CustomResponse } from "../../../Types/ApiTypes";
import type {  ReportEngine } from "../../Types/Settings/ReportEngine.types";
 

const ReportEngineService = {
  async getAllReportEngines(): Promise<ReportEngine[]> {
    const response = await HttpService.callApi<CustomResponse<ReportEngine[]>>(
      API_ENDPOINTS.REPORT_ENGINE.GET_ALL,
      "GET"
    );
    return response.value;
  },

  async getReportEngineById(id: number): Promise<CustomResponse<ReportEngine>> {
    const response = await HttpService.callApi<CustomResponse<ReportEngine>>(
      API_ENDPOINTS.REPORT_ENGINE.GET_BY_ID(id),
      "GET"
    );
    return response;
  },

  async createReportEngine(
    data: ReportEngine
  ): Promise<ReportEngine> {
    const response = await HttpService.callApi<CustomResponse<ReportEngine>>(
      API_ENDPOINTS.REPORT_ENGINE.CREATE,
      "POST",
      data
    );
    return response.value;
  },

  async updateReportEngine(
    id: number,
    data: ReportEngine
  ): Promise<ReportEngine> {
    const response = await HttpService.callApi<CustomResponse<ReportEngine>>(
      API_ENDPOINTS.REPORT_ENGINE.UPDATE(id),
      "PUT",
      data
    );
    return response.value;
  },

  async deleteReportEngine(id: number): Promise<void> {
    await HttpService.callApi<CustomResponse<void>>(
      API_ENDPOINTS.REPORT_ENGINE.DELETE(id),
      "DELETE"
    );
  },
};

export default ReportEngineService;