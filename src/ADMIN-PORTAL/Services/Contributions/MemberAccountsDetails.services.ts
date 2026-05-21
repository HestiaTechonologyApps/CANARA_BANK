// src/Services/MemberAccounts/MemberAccountsDetails.services.ts

import { API_ENDPOINTS } from "../../../CONSTANTS/API_ENDPOINTS";
import HttpService from "../../../Services/Http.services";
import type { CustomResponse } from "../../../Types/ApiTypes";
import type { MemberAccountDetail, MemberAccountsDetailsResponse } from "../../Types/Contributions/MemberAccountsDetails.types";

export default class MemberAccountsDetailsService {

  // ── Get Member Account Details by Member ID ──────────────────────
  static async getById(id: number): Promise<MemberAccountDetail[]> {
    const response = await HttpService.callApi<CustomResponse<MemberAccountsDetailsResponse>>(
      API_ENDPOINTS.MEMBER_ACCOUNTS_DETAILS.GET_BY_ID(id),
      "GET"
    );

    const result = response?.value ?? response;
    return Array.isArray(result?.value) ? result.value : [];
  }

}