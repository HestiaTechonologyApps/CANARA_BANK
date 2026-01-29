import { API_ENDPOINTS } from "../../../CONSTANTS/API_ENDPOINTS";
import HttpService from "../../../Services/HttpService";
import type { CustomResponse } from "../../../Types/ApiTypes";
import type { SupportTicket } from "../../Types/Settings/SupportTicket.types";

const SupportTicketService = {
 
  async getAllSupportTickets(): Promise<SupportTicket[]> {
    const response = await HttpService.callApi<CustomResponse<SupportTicket[]>>(
      API_ENDPOINTS.SUPPORT_TICKET.GET_ALL,
      "GET"
    );
    return response.value;
  },

  async getSupportTicketById(id: number): Promise<CustomResponse<SupportTicket>> {
    const response = await HttpService.callApi<CustomResponse<SupportTicket>>(
      API_ENDPOINTS.SUPPORT_TICKET.GET_BY_ID(id),
      "GET"
    );
  
    return response;
  },

  async createSupportTicket(
    data: Omit<SupportTicket, "supportTicketId" | "auditLogs">
  ): Promise<SupportTicket> {
    const response = await HttpService.callApi<CustomResponse<SupportTicket>>(
      API_ENDPOINTS.SUPPORT_TICKET.CREATE,
      "POST",
      data
    );
    return response.value;
  },

  async updateSupportTicket(
    id: number,
    data: Partial<Omit<SupportTicket, "supportTicketId" | "auditLogs">>
  ): Promise<SupportTicket> {
    const response = await HttpService.callApi<CustomResponse<SupportTicket>>(
      API_ENDPOINTS.SUPPORT_TICKET.UPDATE(id),
      "PUT",
      data
    );
    return response.value;
  },

  async deleteSupportTicket(id: number): Promise<void> {
    await HttpService.callApi<CustomResponse<void>>(
      API_ENDPOINTS.SUPPORT_TICKET.DELETE(id),
      "DELETE"
    );
  },
};

export default SupportTicketService;
