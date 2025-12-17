// src/Services/CMS/DailyNews.services.ts

import { API_ENDPOINTS } from "../../../CONSTANTS/API_ENDPOINTS";
import HttpService from "../../../Services/HttpService";
import type { CustomResponse } from "../../../Types/ApiTypes";
import type { DailyNews } from "../../Types/CMS/DailyNews.types";

const DailyNewsService = {
  async getAllDailyNews(): Promise<DailyNews[]> {
    const response = await HttpService.callApi<CustomResponse<DailyNews[]>>(
      API_ENDPOINTS.DAILY_NEWS.GET_ALL,
      "GET"
    );
    return response.value;
  },

  async getDailyNewsById(id: number): Promise<DailyNews> {
    const response = await HttpService.callApi<CustomResponse<DailyNews>>(
      API_ENDPOINTS.DAILY_NEWS.GET_BY_ID(id),
      "GET"
    );
    return response.value;
  },

  async createDailyNews(data: Omit<DailyNews, "dailyNewsId" | "auditLogs">): Promise<DailyNews> {
    const response = await HttpService.callApi<CustomResponse<DailyNews>>(
      API_ENDPOINTS.DAILY_NEWS.CREATE,
      "POST",
      data
    );
    return response.value;
  },

  async updateDailyNews(
    id: number,
    data: Omit<DailyNews, "auditLogs">
  ): Promise<DailyNews> {
    const response = await HttpService.callApi<CustomResponse<DailyNews>>(
      API_ENDPOINTS.DAILY_NEWS.UPDATE(id),
      "PUT",
      data
    );
    return response.value;
  },

  async deleteDailyNews(id: number): Promise<void> {
    await HttpService.callApi<CustomResponse<null>>(
      API_ENDPOINTS.DAILY_NEWS.DELETE(id),
      "DELETE"
    );
  },
};

export default DailyNewsService;
