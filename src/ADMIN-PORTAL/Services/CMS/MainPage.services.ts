import { API_ENDPOINTS } from "../../../CONSTANTS/API_ENDPOINTS";
import HttpService from "../../../Services/HttpService";
import type { CustomResponse } from "../../../Types/ApiTypes";
import type { MainPage } from "../../Types/CMS/MainPage.types";

const MainPageService = {

  async getAllMainPages(): Promise<MainPage[]> {
    const response = await HttpService.callApi<CustomResponse<MainPage[]>>(
      API_ENDPOINTS.MAIN_PAGE.GET_ALL,
      "GET"
    );
    return response.value;
  },

  async getMainPageById(id: number): Promise<CustomResponse<MainPage>> {
    const response = await HttpService.callApi<CustomResponse<MainPage>>(
      API_ENDPOINTS.MAIN_PAGE.GET_BY_ID(id),
      "GET"
    );
    return response; 
  },

 
  async createMainPage(
    data: Omit<MainPage, "mainPageId" | "auditLogs">
  ): Promise<MainPage> {
    const response = await HttpService.callApi<CustomResponse<MainPage>>(
      API_ENDPOINTS.MAIN_PAGE.CREATE,
      "POST",
      data
    );
    return response.value;
  },

 
  async updateMainPage(
    id: number,
    data: Partial<Omit<MainPage, "mainPageId" | "auditLogs">>
  ): Promise<MainPage> {
    const response = await HttpService.callApi<CustomResponse<MainPage>>(
      API_ENDPOINTS.MAIN_PAGE.UPDATE(id),
      "PUT",
      data
    );
    return response.value;
  },

  async deleteMainPage(id: number): Promise<void> {
    await HttpService.callApi<CustomResponse<void>>(
      API_ENDPOINTS.MAIN_PAGE.DELETE(id),
      "DELETE"
    );
  },
};

export default MainPageService;
