import { API_ENDPOINTS } from "../../../CONSTANTS/API_ENDPOINTS";
import HttpService from "../../../Services/HttpService";
import type { CustomResponse } from "../../../Types/ApiTypes";
import type { MainPage } from "../../Types/CMS/MainPage.types";

const MainPageService = {
  /** Get all main pages */
  async getAllMainPages(): Promise<MainPage[]> {
    const response = await HttpService.callApi<CustomResponse<MainPage[]>>(
      API_ENDPOINTS.MAIN_PAGE.GET_ALL,
      "GET"
    );
    return response.value;
  },

  /** Get main page by ID */
  async getMainPageById(id: number): Promise<MainPage> {
    const response = await HttpService.callApi<CustomResponse<MainPage>>(
      API_ENDPOINTS.MAIN_PAGE.GET_BY_ID(id),
      "GET"
    );
    return response.value;
  },

  /** Create a main page */
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

  /** Update a main page */
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

  /** Delete a main page */
  async deleteMainPage(id: number): Promise<void> {
    await HttpService.callApi<CustomResponse<void>>(
      API_ENDPOINTS.MAIN_PAGE.DELETE(id),
      "DELETE"
    );
  },
};

export default MainPageService;
