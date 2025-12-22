// src/services/Claims/DirectPayment.services.ts

import { API_ENDPOINTS } from "../../../CONSTANTS/API_ENDPOINTS";
import HttpService from "../../../Services/HttpService";
import type { CustomResponse } from "../../../Types/ApiTypes";
import type { DirectPayment } from "../../Types/Contributions/Directpay.types";


const DirectPaymentService = {
  async getAllDirectPayments(): Promise<DirectPayment[]> {
    const response = await HttpService.callApi<CustomResponse<DirectPayment[]>>(
      API_ENDPOINTS.DIRECT_PAY.GET_ALL,
      "GET"
    );
    return response.value;
  },

  async getDirectPaymentById(id: number): Promise<DirectPayment> {
    const response = await HttpService.callApi<CustomResponse<DirectPayment>>(
      API_ENDPOINTS.DIRECT_PAY.GET_BY_ID(id),
      "GET"
    );
    return response.value;
  },

  async createDirectPayment(
    data: Omit<DirectPayment, "directPaymentId" | "auditLogs">
  ): Promise<DirectPayment> {
    const response = await HttpService.callApi<CustomResponse<DirectPayment>>(
      API_ENDPOINTS.DIRECT_PAY.CREATE,
      "POST",
      data
    );
    return response.value;
  },

  async updateDirectPayment(
    id: number,
    data: Partial<Omit<DirectPayment, "directPaymentId" | "auditLogs">>
  ): Promise<DirectPayment> {
    const response = await HttpService.callApi<CustomResponse<DirectPayment>>(
      API_ENDPOINTS.DIRECT_PAY.UPDATE(id),
      "PUT",
      data
    );
    return response.value;
  },

  async deleteDirectPayment(id: number): Promise<void> {
    await HttpService.callApi<CustomResponse<void>>(
      API_ENDPOINTS.DIRECT_PAY.DELETE(id),
      "DELETE"
    );
  }
};

export default DirectPaymentService;
