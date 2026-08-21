import { API_ENDPOINTS } from "../../../CONSTANTS/API_ENDPOINTS";
import HttpService from "../../../Services/Http.services";
import type { CustomResponse } from "../../../Types/ApiTypes";
import type { PublicPage } from "../../Types/CMS/PublicPage.types";

const PublicPageService = {
  async getAllPublicPages(): Promise<PublicPage[]> {
    const response = await HttpService.callApi<CustomResponse<PublicPage[]>>(
      API_ENDPOINTS.PUBLIC_PAGE.GET_ALL,
      "GET"
    );
    return response.value;
  },

  async getPublicPageById(id: number): Promise<PublicPage> {
    const response = await HttpService.callApi<CustomResponse<PublicPage>>(
      API_ENDPOINTS.PUBLIC_PAGE.GET_BY_ID(id),
      "GET"
    );
    return response.value; 
  },

  async createPublicPage(
    data: Omit<PublicPage, "publicPageId" | "auditLogs">
  ): Promise<PublicPage> {
    const response = await HttpService.callApi<CustomResponse<PublicPage>>(
      API_ENDPOINTS.PUBLIC_PAGE.CREATE,
      "POST",
      data
    );
    return response.value;
  },

  async updatePublicPage(
    id: number,
    data: Omit<PublicPage, "publicPageId" | "auditLogs">
  ): Promise<PublicPage> {
    const response = await HttpService.callApi<CustomResponse<PublicPage>>(
      API_ENDPOINTS.PUBLIC_PAGE.UPDATE(id),
      "PUT",
      data
    );
    return response.value;
  },

  async deletePublicPage(id: number): Promise<void> {
    await HttpService.callApi<CustomResponse<void>>(
      API_ENDPOINTS.PUBLIC_PAGE.DELETE(id),
      "DELETE"
    );
  },
};

export default PublicPageService;
