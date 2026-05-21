// src/ADMIN-PORTAL/Services/Accounts/AccountDirectEntry.services.ts
import { API_ENDPOINTS } from "../../../CONSTANTS/API_ENDPOINTS";
import HttpService from "../../../Services/HttpService";
import type { CustomResponse } from "../../../Types/ApiTypes";
import type { AccountDirectEntry } from "../../Types/Contributions/AccountDirectEntry.types";

const AccountDirectEntryService = {
  
  async getAllAccountDirectEntries(): Promise<AccountDirectEntry[]> {
    const response = await HttpService.callApi<
      CustomResponse<AccountDirectEntry[]>
    >(
      API_ENDPOINTS.ACCOUNT_DIRECT_ENTRY.GET_ALL,
      "GET"
    );
    return response.value;
  },

 
  async getAccountDirectEntryById(
    id: number
  ): Promise<CustomResponse<AccountDirectEntry>> {
    const response = await HttpService.callApi<
      CustomResponse<AccountDirectEntry>
    >(
      API_ENDPOINTS.ACCOUNT_DIRECT_ENTRY.GET_BY_ID(id),
      "GET"
    );
    return response;
  },

 
  async createAccountDirectEntry(
    data: Omit<AccountDirectEntry, "accountsDirectEntryID" | "auditLogs">
  ): Promise<AccountDirectEntry> {
    const response = await HttpService.callApi<
      CustomResponse<AccountDirectEntry>
    >(
      API_ENDPOINTS.ACCOUNT_DIRECT_ENTRY.CREATE,
      "POST",
      data
    );
    return response.value;
  },

 
  async updateAccountDirectEntry(
    id: number,
    data: Partial<Omit<AccountDirectEntry, "accountsDirectEntryID" | "auditLogs">>
  ): Promise<AccountDirectEntry> {
    const response = await HttpService.callApi<
      CustomResponse<AccountDirectEntry>
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

 
  async getAccountDirectEntryByStaffId(
    memberId: number
  ): Promise<CustomResponse<AccountDirectEntry[]>> {
    const response = await HttpService.callApi<
      CustomResponse<AccountDirectEntry[]>
    >(
      API_ENDPOINTS.ACCOUNT_DIRECT_ENTRY.GET_BY_STAFFID(memberId),
      "GET"
    );
    return response;
  },
};

export default AccountDirectEntryService;
