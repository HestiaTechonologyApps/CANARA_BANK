import { API_ENDPOINTS } from "../../../CONSTANTS/API_ENDPOINTS";
import HttpService from "../../../Services/Http.services";
import type { CustomResponse } from "../../../Types/ApiTypes";
import type { ExpenseType, ExpenseTypePayload } from "../../Types/Administration/ExpenseType.types";

const ExpenseTypeService = {
  async getAll(): Promise<ExpenseType[]> {
    const response = await HttpService.callApi<CustomResponse<ExpenseType[]>>(
      API_ENDPOINTS.EXPENSE_TYPE.GET_ALL,
      "GET"
    );
    return response.value;
  },

  async getById(id: number): Promise<ExpenseType> {
    const response = await HttpService.callApi<CustomResponse<ExpenseType>>(
      API_ENDPOINTS.EXPENSE_TYPE.GET_BY_ID(id),
      "GET"
    );
    return response.value;
  },

  async create(data: ExpenseTypePayload): Promise<ExpenseType> {
    const response = await HttpService.callApi<CustomResponse<ExpenseType>>(
      API_ENDPOINTS.EXPENSE_TYPE.CREATE,
      "POST",
      data
    );
    return response.value;
  },

  async update(id: number, data: ExpenseTypePayload): Promise<ExpenseType> {
    const response = await HttpService.callApi<CustomResponse<ExpenseType>>(
      API_ENDPOINTS.EXPENSE_TYPE.UPDATE(id),
      "PUT",
      data
    );
    return response.value;
  },

  async delete(id: number): Promise<void> {
    await HttpService.callApi<CustomResponse<void>>(
      API_ENDPOINTS.EXPENSE_TYPE.DELETE(id),
      "DELETE"
    );
  },
};

export default ExpenseTypeService;