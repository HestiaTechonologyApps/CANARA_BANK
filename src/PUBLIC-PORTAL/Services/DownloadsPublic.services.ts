import { API_ENDPOINTS } from "../../CONSTANTS/API_ENDPOINTS";
import HttpService from "../../Services/HttpService";
import type { CustomResponse } from "../../Types/ApiTypes";
import type { Attachment } from "../../Types/Attachment.types";

const PublicAttachmentService = {
  /**
   * Get all public attachments (Downloads page)
   */
  async getPublicAttachments(): Promise<Attachment[]> {
    const response = await HttpService.callApi<
      CustomResponse<Attachment[]>
    >(
      API_ENDPOINTS.PUBLIC. GET_ALL_ATTACHMENTS,
      "GET"
    );

    return response.value;
  },

  /**
   * Download attachment by attachmentId
   */
  async downloadAttachment(
    attachmentId: number
  ): Promise<Blob> {
    const response = await fetch(
      API_ENDPOINTS.ATTACHMENT.DOWNLOAD(attachmentId),
      { method: "GET" }
    );

    if (!response.ok) {
      throw new Error("Download failed");
    }

    return response.blob();
  },
};

export default PublicAttachmentService;
