// src/services/AccountDirectEntryService.ts

import type { AccountDirectEntry } from "../../ADMIN-PORTAL/Types/Contributions/AccountDirectEntry.types";
import { API_ENDPOINTS } from "../../CONSTANTS/API_ENDPOINTS";
import HttpService from "../../Services/Http.services";
import type { CustomResponse } from "../../Types/ApiTypes";
//import type { AccountDirectEntry } from "../Types/AccountDirectEntry.types";

const AccountDirectEntryService = {
  async getAllAccountDirectEntries(): Promise<AccountDirectEntry[]> {
    const response = await HttpService.callApi<CustomResponse<AccountDirectEntry[]>>(
      API_ENDPOINTS.ACCOUNT_DIRECT_ENTRY.GET_ALL,
      "GET"
    );
    return response.value;
  },

  async getAccountDirectEntryById(id: number): Promise<CustomResponse<AccountDirectEntry>> {
    const response = await HttpService.callApi<CustomResponse<AccountDirectEntry>>(
      API_ENDPOINTS.ACCOUNT_DIRECT_ENTRY.GET_BY_ID(id),
      "GET"
    );
    return response;
  },

  async createAccountDirectEntry(
    data: Omit<AccountDirectEntry, "accountsDirectEntryID">
  ): Promise<AccountDirectEntry> {
    const response = await HttpService.callApi<CustomResponse<AccountDirectEntry>>(
      API_ENDPOINTS.ACCOUNT_DIRECT_ENTRY.CREATE,
      "POST",
      data
    );
    return response.value;
  },

  async updateAccountDirectEntry(
    id: number,
    data: Partial<Omit<AccountDirectEntry, "accountsDirectEntryID">>
  ): Promise<AccountDirectEntry> {
    const response = await HttpService.callApi<CustomResponse<AccountDirectEntry>>(
      API_ENDPOINTS.ACCOUNT_DIRECT_ENTRY.UPDATE(id),
      "PUT",
      data
    );
    return response.value;
  },

  async deleteAccountDirectEntry(id: number): Promise<void> {
    await HttpService.callApi<CustomResponse<void>>(
      API_ENDPOINTS.ACCOUNT_DIRECT_ENTRY.DELETE(id),
      "DELETE"
    );
  },
};

export default AccountDirectEntryService;