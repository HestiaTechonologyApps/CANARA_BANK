import { API_ENDPOINTS } from "../../../CONSTANTS/API_ENDPOINTS";
import HttpService from "../../../Services/Http.services";
import type { CustomResponse } from "../../../Types/ApiTypes";
import type {
  ContributionDetailItem,
  ParkPayload,
  UnparkParams,
} from "../../Types/Contributions/ContributionDetail.types";

export default class ContributionDetailService {
  static async getByDetailId(
    detailId: number
  ): Promise<ContributionDetailItem> {
    const response = await HttpService.callApi<CustomResponse<ContributionDetailItem>>(
      API_ENDPOINTS.CONTRIBUTION_DETAIL.GET_BY_DETAIL_ID(detailId),
      "GET"
    );

    return response?.value ?? response;
  }

  static async park(
    detailId: number,
    payload: ParkPayload
  ): Promise<void> {
    await HttpService.callApi<CustomResponse<void>>(
      API_ENDPOINTS.CONTRIBUTION_DETAIL.CREATE_PARK(detailId),
      "POST",
      payload
    );
  }

  static async unpark(
    params: UnparkParams
  ): Promise<void> {
    const { detailId, currentUserId } = params;

    const query = new URLSearchParams();
    query.append("currentUserId", String(currentUserId));

    const url = `${API_ENDPOINTS.CONTRIBUTION_DETAIL.CREATE_UNPARK(detailId)}?${query.toString()}`;

    await HttpService.callApi<CustomResponse<void>>(
      url,
      "POST"
    );
  }
}