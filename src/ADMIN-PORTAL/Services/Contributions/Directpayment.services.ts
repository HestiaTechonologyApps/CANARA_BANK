import { API_ENDPOINTS } from "../../../CONSTANTS/API_ENDPOINTS";
import HttpService from "../../../Services/HttpService";
import type { CustomResponse } from "../../../Types/ApiTypes";
import type { DirectPayment } from "../../Types/Contributions/Directpayment.types";


const DirectPaymentService = {
  // ✅ LIST
  async getAllDirectPayments(): Promise<DirectPayment[]> {
    const response = await HttpService.callApi<CustomResponse<DirectPayment[]>>(
      API_ENDPOINTS.DIRECT_PAY.GET_ALL,
      "GET"
    );
    return response.value;
  },

  // ✅ GET BY ID (RETURN FULL RESPONSE – REQUIRED for KiduEdit)
  async getDirectPaymentById(
    id: number
  ): Promise<CustomResponse<DirectPayment>> {
    return await HttpService.callApi<CustomResponse<DirectPayment>>(
      API_ENDPOINTS.DIRECT_PAY.GET_BY_ID(id),
      "GET"
    );
  },

  // ✅ CREATE
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

  // ✅ UPDATE
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

  // ✅ DELETE
  async deleteDirectPayment(id: number): Promise<void> {
    await HttpService.callApi<CustomResponse<void>>(
      API_ENDPOINTS.DIRECT_PAY.DELETE(id),
      "DELETE"
    );
  }
};

export default DirectPaymentService;
