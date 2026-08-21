import { API_ENDPOINTS } from "../../../CONSTANTS/API_ENDPOINTS";
import HttpService from "../../../Services/Http.services";
import type { CustomResponse } from "../../../Types/ApiTypes";
import type { ExpenseMaster, ExpenseMasterPayload, ExpenseMasterPagedParams,
} from "../../Types/Administration/ExpenseMaster.types";

const ExpenseMasterService = {
  async getAll(): Promise<ExpenseMaster[]> {
    const response = await HttpService.callApi<CustomResponse<ExpenseMaster[]>>(
      API_ENDPOINTS.EXPENSE_MASTER.GET_ALL,
      "GET"
    );
    return response.value;
  },

  async getById(id: number): Promise<ExpenseMaster> {
    const response = await HttpService.callApi<CustomResponse<ExpenseMaster>>(
      API_ENDPOINTS.EXPENSE_MASTER.GET_BY_ID(id),
      "GET"
    );
    return response.value;
  },

  async create(data: ExpenseMasterPayload): Promise<ExpenseMaster> {
    const response = await HttpService.callApi<CustomResponse<ExpenseMaster>>(
      API_ENDPOINTS.EXPENSE_MASTER.CREATE,
      "POST",
      data
    );
    return response.value;
  },

  async update(id: number, data: ExpenseMasterPayload): Promise<ExpenseMaster> {
    const response = await HttpService.callApi<CustomResponse<ExpenseMaster>>(
      API_ENDPOINTS.EXPENSE_MASTER.UPDATE(id),
      "PUT",
      data
    );
    return response.value;
  },

  async delete(id: number): Promise<void> {
    await HttpService.callApi<CustomResponse<void>>(
      API_ENDPOINTS.EXPENSE_MASTER.DELETE(id),
      "DELETE"
    );
  },

  async getPaged(
    params: ExpenseMasterPagedParams
  ): Promise<{ data: ExpenseMaster[]; total: number }> {
    const queryParams = new URLSearchParams();

    if (params.expenseMasterId !== undefined)
      queryParams.append("ExpenseMasterId", String(params.expenseMasterId));
    if (params.expenseTypeId !== undefined)
      queryParams.append("ExpenseTypeId", String(params.expenseTypeId));
    if (params.fromDate) queryParams.append("FromDate", params.fromDate);
    if (params.toDate) queryParams.append("ToDate", params.toDate);
    if (params.searchTerm) queryParams.append("SearchTerm", params.searchTerm);
    if (params.sortBy) queryParams.append("SortBy", params.sortBy);
    if (params.sortDescending !== undefined)
      queryParams.append("SortDescending", String(params.sortDescending));
    queryParams.append("PageNumber", String(params.pageNumber));
    queryParams.append("PageSize", String(params.pageSize));
    if (params.getAll !== undefined) queryParams.append("GetAll", String(params.getAll));

    const url = `${API_ENDPOINTS.EXPENSE_MASTER.GET_ALL_PAGINATED}?${queryParams.toString()}`;

    type PagedExpenseMasterResponse = CustomResponse<{
      data: ExpenseMaster[];
      totalRecords: number;
      pageNumber: number;
      pageSize: number;
    }>;

    const response = await HttpService.callApi<PagedExpenseMasterResponse>(url, "GET");

    return {
      data: response.value.data,
      total: response.value.totalRecords,
    };
  },

  async approveExpenseMaster(
    id: number,
    params: { approve: boolean; currentUserId: number }
  ): Promise<ExpenseMaster> {
    const url = `${API_ENDPOINTS.EXPENSE_MASTER.UPDATE_BY_APPROVE(id)}?approve=${params.approve}&currentUserId=${params.currentUserId}`;
    const response = await HttpService.callApi<CustomResponse<ExpenseMaster>>(url, "PUT");
    return response.value;
  },
};

export default ExpenseMasterService;