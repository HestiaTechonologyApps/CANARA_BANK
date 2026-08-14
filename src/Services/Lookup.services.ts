// src/Services/Common/Lookup.services.ts

import { API_ENDPOINTS } from "../CONSTANTS/API_ENDPOINTS";
import type { BranchLookupItem, ExpenseTypeLookupItem, LookupPagedParams, LookupPagedResponse, MemberLookupItem } from "../Types/Lookup.types";
import HttpService from "./Http.services";


async function fetchPagedLookup<T>(
  params: LookupPagedParams
): Promise<LookupPagedResponse<T>> {
  try {
    const query = new URLSearchParams({
      entityName: params.entityName,
      pageNumber: String(params.pageNumber ?? 1),
      pageSize: String(params.pageSize ?? 20),
      searchTerm: params.searchTerm ?? "",
      lookupMasterId: String(params.lookupMasterId ?? 0),
      ...(params.selectedId != null
        ? { selectedId: String(params.selectedId) }
        : {}),
    });

    const url = `${API_ENDPOINTS.LOOKUP.PAGED}?${query.toString()}`;
    const res = await HttpService.callApi<any>(url, "GET", null, false);

    if (res?.isSucess && res.value) {
      return {
        total: res.value.total ?? 0,
        data: Array.isArray(res.value.data) ? (res.value.data as T[]) : [],
      };
    }
    return { total: 0, data: [] };
  } catch {
    return { total: 0, data: [] };
  }
}

const LookupService = {
  getMembers: (params: Omit<LookupPagedParams, "entityName">) =>
    fetchPagedLookup<MemberLookupItem>({
      ...params,
      entityName: "member",
    }),

  getBranches: (params: Omit<LookupPagedParams, "entityName">) =>
    fetchPagedLookup<BranchLookupItem>({
      ...params,
      entityName: "branch",
    }),

  getExpenseTypes: (params: Omit<LookupPagedParams, "entityName">) =>
    fetchPagedLookup<ExpenseTypeLookupItem>({
      ...params,
      entityName: "expensetype",
    }),

  get: <T>(params: LookupPagedParams) => fetchPagedLookup<T>(params),
};


export default LookupService;