// src/ADMIN-PORTAL/Services/Accounts/AccountDirectEntry.services.ts
import { API_ENDPOINTS } from "../../../CONSTANTS/API_ENDPOINTS";
import HttpService from "../../../Services/HttpService";
import type { CustomResponse } from "../../../Types/ApiTypes";
import type { AccountsDirectEntry } from "../../Types/Contributions/AccountDirectEntry.types";

const AccountDirectEntryService = {
  async getAllAccountDirectEntries(): Promise<AccountsDirectEntry[]> {
    const response = await HttpService.callApi<
      CustomResponse<AccountsDirectEntry[]>
    >(
      API_ENDPOINTS.ACCOUNT_DIRECT_ENTRY.GET_ALL,
      "GET"
    );
    return response.value;
  },

  async getAccountDirectEntryById(
    id: number
  ): Promise<CustomResponse<AccountsDirectEntry>> {
    const response = await HttpService.callApi<
      CustomResponse<AccountsDirectEntry>
    >(
      API_ENDPOINTS.ACCOUNT_DIRECT_ENTRY.GET_BY_ID(id),
      "GET"
    );
    return response;
  },

  async createAccountDirectEntry(
    data: Omit<AccountsDirectEntry, "accountsDirectEntryID" | "auditLogs">
  ): Promise<AccountsDirectEntry> {
    const response = await HttpService.callApi<
      CustomResponse<AccountsDirectEntry>
    >(
      API_ENDPOINTS.ACCOUNT_DIRECT_ENTRY.CREATE,
      "POST",
      data
    );
    return response.value;
  },

  async updateAccountDirectEntry(
    id: number,
    data: Partial<Omit<AccountsDirectEntry, "accountsDirectEntryID" | "auditLogs">>
  ): Promise<AccountsDirectEntry> {
    const response = await HttpService.callApi<
      CustomResponse<AccountsDirectEntry>
    >(
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
