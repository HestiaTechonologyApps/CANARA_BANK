import { API_ENDPOINTS } from "../../../CONSTANTS/API_ENDPOINTS";
import HttpService from "../../../Services/HttpService";
import type { CustomResponse } from "../../../Types/ApiTypes";
import type { DailyNews } from "../../Types/CMS/DailyNews.types";

const DailyNewsService = {
  async getAllDailyNews(): Promise<DailyNews[]> {
    const res = await HttpService.callApi<CustomResponse<DailyNews[]>>(
      API_ENDPOINTS.DAILY_NEWS.GET_ALL,
      "GET"
    );
    return res.value;
  },

  async getDailyNewsById(id: number): Promise<CustomResponse<DailyNews>> {
    return HttpService.callApi<CustomResponse<DailyNews>>(
      API_ENDPOINTS.DAILY_NEWS.GET_BY_ID(id),
      "GET"
    );
  },

  async createDailyNews(data: Omit<DailyNews, "dailyNewsId" | "auditLogs">) {
    return HttpService.callApi(
      API_ENDPOINTS.DAILY_NEWS.CREATE,
      "POST",
      data
    );
  },

  async updateDailyNews(id: number, data: Omit<DailyNews, "auditLogs">) {
    return HttpService.callApi(
      API_ENDPOINTS.DAILY_NEWS.UPDATE(id),
      "PUT",
      data
    );
  },

  async deleteDailyNews(id: number) {
    return HttpService.callApi(
      API_ENDPOINTS.DAILY_NEWS.DELETE(id),
      "DELETE"
    );
  },
};

export default DailyNewsService;
