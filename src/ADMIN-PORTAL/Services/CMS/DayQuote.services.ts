// src/Services/CMS/DayQuote.services.ts
import { API_ENDPOINTS } from "../../../CONSTANTS/API_ENDPOINTS";
import HttpService from "../../../Services/HttpService";
import type { CustomResponse } from "../../../Types/ApiTypes";
import type { DayQuote } from "../../Types/CMS/DayQuote.types";

const DayQuoteService = {
  async getAllDayQuotes(): Promise<DayQuote[]> {
    const response = await HttpService.callApi<CustomResponse<DayQuote[]>>(
      API_ENDPOINTS.DAY_QUOTE.GET_ALL,
      "GET"
    );
    return response.value;
  },

  // 🔥 MUST RETURN CustomResponse (KiduEdit requires this)
  async getDayQuoteById(
    id: number
  ): Promise<CustomResponse<DayQuote>> {
    return await HttpService.callApi<CustomResponse<DayQuote>>(
      API_ENDPOINTS.DAY_QUOTE.GET_BY_ID(id),
      "GET"
    );
  },

  async createDayQuote(
    data: Omit<DayQuote, "dayQuoteId" | "auditLogs">
  ): Promise<DayQuote> {
    const response = await HttpService.callApi<CustomResponse<DayQuote>>(
      API_ENDPOINTS.DAY_QUOTE.CREATE,
      "POST",
      data
    );
    return response.value;
  },

  async updateDayQuote(
    id: number,
    data: Partial<Omit<DayQuote, "dayQuoteId" | "auditLogs">>
  ): Promise<DayQuote> {
    const response = await HttpService.callApi<CustomResponse<DayQuote>>(
      API_ENDPOINTS.DAY_QUOTE.UPDATE(id),
      "PUT",
      data
    );
    return response.value;
  },

  async deleteDayQuote(id: number): Promise<void> {
    await HttpService.callApi<CustomResponse<void>>(
      API_ENDPOINTS.DAY_QUOTE.DELETE(id),
      "DELETE"
    );
  },
};

export default DayQuoteService;
