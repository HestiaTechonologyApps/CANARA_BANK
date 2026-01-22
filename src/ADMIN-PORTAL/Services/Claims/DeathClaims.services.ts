import { API_ENDPOINTS } from "../../../CONSTANTS/API_ENDPOINTS";
import HttpService from "../../../Services/HttpService";
import type { CustomResponse } from "../../../Types/ApiTypes";
import type { DeathClaim } from "../../Types/Claims/DeathClaims.type";


const DeathClaimService = {
  async getAllDeathClaims(): Promise<DeathClaim[]> {
    const response = await HttpService.callApi<CustomResponse<DeathClaim[]>>(
      API_ENDPOINTS.DEATH_CLAIMS.GET_ALL,
      "GET"
    );
    return response.value;
  },

  async getDeathClaimById(id: number): Promise<CustomResponse<DeathClaim>> {
    const response = await HttpService.callApi<CustomResponse<DeathClaim>>(
      API_ENDPOINTS.DEATH_CLAIMS.GET_BY_ID(id),
      "GET"
    );
    
    return response;
  },

  async createDeathClaim(
    data: Omit<DeathClaim, "deathClaimId">
  ): Promise<DeathClaim> {
    const response = await HttpService.callApi<CustomResponse<DeathClaim>>(
      API_ENDPOINTS.DEATH_CLAIMS.CREATE,
      "POST",
      data
    );
    return response.value;
  },

  async updateDeathClaim(
    id: number,
    data: Partial<Omit<DeathClaim, "deathClaimId">>
  ): Promise<DeathClaim> {
    const response = await HttpService.callApi<CustomResponse<DeathClaim>>(
      API_ENDPOINTS.DEATH_CLAIMS.UPDATE(id),
      "PUT",
      data
    );
    return response.value;
  },

  async deleteDeathClaim(id: number): Promise<void> {
    await HttpService.callApi<CustomResponse<void>>(
      API_ENDPOINTS.DEATH_CLAIMS.DELETE(id),
      "DELETE"
    );
  },
};

export default DeathClaimService;
