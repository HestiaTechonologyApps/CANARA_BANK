// src/ADMIN-PORTAL/Services/Accounts/AccountDirectEntry.services.ts
import { API_ENDPOINTS } from "../../../CONSTANTS/API_ENDPOINTS";
import HttpService from "../../../Services/Http.services";
import type { CustomResponse } from "../../../Types/ApiTypes";
import type { AccountDirectEntry, ApproveAccountDirectEntryParams } from "../../Types/Contributions/AccountDirectEntry.types";

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

  async approveAccountDirectEntry(
  id: number,
  params: ApproveAccountDirectEntryParams
): Promise<AccountDirectEntry> {
  const url = `${API_ENDPOINTS.ACCOUNT_DIRECT_ENTRY.UPDATE_BY_APPROVE(id)}?approve=${params.approve}&currentUserId=${params.currentUserId}`;
  const response = await HttpService.callApi<CustomResponse<AccountDirectEntry>>(url, "PUT");
  return response.value;
},
};

export default AccountDirectEntryService;
