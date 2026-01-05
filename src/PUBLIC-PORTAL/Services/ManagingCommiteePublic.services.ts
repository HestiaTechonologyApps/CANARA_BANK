import type { ManagingCommittee } from "../../ADMIN-PORTAL/Types/CMS/ManagingCommittee.types";
import { API_ENDPOINTS } from "../../CONSTANTS/API_ENDPOINTS";
import HttpService from "../../Services/HttpService";
import type { CustomResponse } from "../../Types/ApiTypes";

const PublicManagingCommitteeService = {
  async getManagingCommittee(): Promise<ManagingCommittee[]> {
    const response = await HttpService.callApi<
      CustomResponse<ManagingCommittee[]>
    >(
      API_ENDPOINTS.PUBLIC.GET_ALL_MANAGINGCOMMITEE,
      "GET"
    );

    return response.value;
  },
};

export default PublicManagingCommitteeService;
