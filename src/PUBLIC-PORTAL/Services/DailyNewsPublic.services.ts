// src/Services/Public/DailyNewsPublic.services.ts

import type { DailyNews } from "../../ADMIN-PORTAL/Types/CMS/DailyNews.types";
import { API_ENDPOINTS } from "../../CONSTANTS/API_ENDPOINTS";
import HttpService from "../../Services/Http.services";
import type { CustomResponse } from "../../Types/ApiTypes";

const DailyNewsPublicService = {
 
  async getAllDailyNews(): Promise<DailyNews[]> {
    const response = await HttpService.callApi<CustomResponse<DailyNews[]>>(
      API_ENDPOINTS.PUBLIC.GET_ALL_DAILYNEWS,
      "GET"
    );
    return response.value;
  },


  async getLatestNews(count: number): Promise<DailyNews[]> {
    const allNews = await this.getAllDailyNews();
    
    return allNews
      .filter(news => news.isActive && !news.isDeleted)
      .sort((a, b) => {
        const dateA = new Date(a.createdOn).getTime();
        const dateB = new Date(b.createdOn).getTime();
        return dateB - dateA; 
      })
      .slice(0, count); 
  },


  async getLatestThreeNews(): Promise<DailyNews[]> {
    return this.getLatestNews(3);
  },

  async getLatestNineNews(): Promise<DailyNews[]> {
    return this.getLatestNews(9);
  },
};

export default DailyNewsPublicService;