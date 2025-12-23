// src/services/DayQuotePublicService.ts

import type { DayQuote } from "../../ADMIN-PORTAL/Types/CMS/DayQuote.types";
import { API_ENDPOINTS } from "../../CONSTANTS/API_ENDPOINTS";
import HttpService from "../../Services/HttpService";
import type { CustomResponse } from "../../Types/ApiTypes";

const DayQuotePublicService = {
  // ✅ NEW: Get all day quotes from public endpoint
  async getAllDayQuotes(): Promise<DayQuote[]> {
    const response = await HttpService.callApi<CustomResponse<DayQuote[]>>(
      API_ENDPOINTS.PUBLIC.GET_ALL_DAYQUOTE,
      "GET"
    );
    return response.value;
  },

  // ✅ NEW: Helper method to get the last/latest quote
  async getLastQuote(): Promise<DayQuote | null> {
    const quotes = await this.getAllDayQuotes();
    if (quotes && quotes.length > 0) {
      return quotes[quotes.length - 1];
    }
    return null;
  },
};

export default DayQuotePublicService;