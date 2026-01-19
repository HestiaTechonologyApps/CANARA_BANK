// src/Services/ContactMessage/ContactMessage.service.ts

import { API_ENDPOINTS } from "../../CONSTANTS/API_ENDPOINTS";
import HttpService from "../../Services/HttpService";
import type { CustomResponse } from "../../Types/ApiTypes";
import type { ContactMessage } from "../Types/ContactMessage.types";

interface ContactMessageResponse {
  message: string;
  contactMessageId: number;
  submittedAt: string;
}

const ContactMessageService = {
  async submitMessage(
    payload: ContactMessage
  ): Promise<ContactMessageResponse> {
    const response = await HttpService.callApi<
      CustomResponse<ContactMessageResponse>
    >(
      API_ENDPOINTS.CONTACT_MESSAGE.CREATE,
      "POST",
      payload
    );

    return response.value; // 👈 important
  },
};

export default ContactMessageService;
