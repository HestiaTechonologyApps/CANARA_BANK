import { API_ENDPOINTS } from "../../CONSTANTS/API_ENDPOINTS";
import HttpService from "../../Services/Http.services";
import type { CustomResponse } from "../../Types/ApiTypes";
import type { ClaimsSettledStats } from "../Types/ClaimSettled.types";

const ClaimsSettledService = {
  async getClaimsSettledStats(): Promise<ClaimsSettledStats> {
    const response = await HttpService.callApi<CustomResponse<ClaimsSettledStats>>(
      API_ENDPOINTS.CLAIM_SETTLED.GET,
      "GET"
    );
    return response.value;
  },
};

export default ClaimsSettledService;