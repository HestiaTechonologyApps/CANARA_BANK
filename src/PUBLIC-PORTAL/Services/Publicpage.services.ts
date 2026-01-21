import type { PublicPage } from "../../ADMIN-PORTAL/Types/CMS/PublicPage.types";
import { API_ENDPOINTS } from "../../CONSTANTS/API_ENDPOINTS";
import HttpService from "../../Services/HttpService";
import type { CustomResponse } from "../../Types/ApiTypes";

const PublicPageConfigService = {
  /**
   * Fetch public page configuration
   * Backend returns array (usually single record)
   */
  async getPublicPageConfig(): Promise<PublicPage[]> {
    const response = await HttpService.callApi<
      CustomResponse<PublicPage[]>
    >(
      API_ENDPOINTS.PUBLIC_PAGE.GET_ALL,
      "GET"
    );
    return response.value;
  },
};

export default PublicPageConfigService;
