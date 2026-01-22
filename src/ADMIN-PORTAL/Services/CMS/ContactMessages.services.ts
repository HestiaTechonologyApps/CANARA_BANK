import { API_ENDPOINTS } from "../../../CONSTANTS/API_ENDPOINTS";
import HttpService from "../../../Services/HttpService";
import type { CustomResponse } from "../../../Types/ApiTypes";
import type { ContactMessage } from "../../Types/CMS/ContactMessages.types";


const ContactMessageService = {
 
  async getAllContactMessages(): Promise<ContactMessage[]> {
    const response = await HttpService.callApi<
      CustomResponse<ContactMessage[]>
    >(
      API_ENDPOINTS.CONTACT_MESSAGE.GET_ALL,
      "GET"
    );

    return response.value;
  },


  async getContactMessageById(
    id: number
  ): Promise<CustomResponse<ContactMessage>> {
    const response = await HttpService.callApi<
      CustomResponse<ContactMessage>
    >(
      API_ENDPOINTS.CONTACT_MESSAGE.GET_BY_ID(id),
      "GET"
    );

    return response;
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
      | "auditLogs"
    >
  ): Promise<ContactMessage> {
    const response = await HttpService.callApi<
      CustomResponse<ContactMessage>
    >(
      API_ENDPOINTS.CONTACT_MESSAGE.CREATE,
      "POST",
      data
    );

    return response.value;
  },
};

export default ContactMessageService;
