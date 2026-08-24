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

    async getPagedAccountDirectEntries(params: {
    pageNumber: number;
    pageSize: number;
    searchTerm?: string;
    sortBy?: string;
    sortOrder?: "asc" | "desc";
  }): Promise<{ data: AccountDirectEntry[]; total: number }> {
    const isAll = params.pageSize === -1;
    const queryParams = new URLSearchParams();
    queryParams.append("PageNumber", String(params.pageNumber));
    queryParams.append("PageSize", String(isAll ? 1 : params.pageSize));
    if (isAll) queryParams.append("GetAll", "true");
    if (params.searchTerm) queryParams.append("SearchTerm", params.searchTerm);
    if (params.sortBy) queryParams.append("SortBy", params.sortBy);
    if (params.sortOrder) queryParams.append("SortDescending", String(params.sortOrder === "desc"));

    const url = `${API_ENDPOINTS.ACCOUNT_DIRECT_ENTRY.GET_PAGED}?${queryParams.toString()}`;

    type PagedAccountDirectEntryResponse = CustomResponse<{
      data: AccountDirectEntry[];
      totalRecords: number;
      pageNumber: number;
      pageSize: number;
    }>;

    const response = await HttpService.callApi<PagedAccountDirectEntryResponse>(url, "GET");

    return {
      data: response.value.data,
      total: response.value.totalRecords,
    };
  },
};

export default AccountDirectEntryService;
