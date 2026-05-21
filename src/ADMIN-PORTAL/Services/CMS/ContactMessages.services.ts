import { API_ENDPOINTS } from "../../../CONSTANTS/API_ENDPOINTS";
import HttpService from "../../../Services/Http.services";
import type { CustomResponse } from "../../../Types/ApiTypes";
import type { ContactMessage } from "../../Types/CMS/ContactMessages.types";

const ContactMessageService = {

  async getAllContactMessages(): Promise<ContactMessage[]> {
    const response = await HttpService.callApi<CustomResponse<ContactMessage[]>>(
      API_ENDPOINTS.CONTACT_MESSAGE.GET_ALL,
      "GET"
    );

    return response.value;
  },

  async getContactMessageById(id: number): Promise<ContactMessage> {
    const response = await HttpService.callApi<CustomResponse<ContactMessage>>(
      API_ENDPOINTS.CONTACT_MESSAGE.GET_BY_ID(id),
      "GET"
    );

    return response.value;
  },

  async submitContactMessage(
    data: Omit<
      ContactMessage,
      | "contactMessageId"
      | "submittedAt"
      | "isRead"
      | "isReplied"
      | "adminNotes"
      | "repliedAt"
      | "ipAddress"
      | "auditLogs"
    >
  ): Promise<ContactMessage> {
    const response = await HttpService.callApi<CustomResponse<ContactMessage>>(
      API_ENDPOINTS.CONTACT_MESSAGE.CREATE,
      "POST",
      data
    );

    return response.value;
  },

  async markAsRead(id: number): Promise<void> {
    await HttpService.callApi<CustomResponse<{ message: string }>>(
      API_ENDPOINTS.CONTACT_MESSAGE.MARK_AS_READ(id),
      "PATCH"
    );
  },

  async markAsReplied(id: number, adminNotes?: string): Promise<void> {
    await HttpService.callApi<CustomResponse<{ message: string }>>(
      API_ENDPOINTS.CONTACT_MESSAGE.MARK_AS_REPLIED(id),
      "PATCH",
      { adminNotes: adminNotes || "" }
    );
  },
};

export default ContactMessageService;