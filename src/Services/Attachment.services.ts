import { API_ENDPOINTS } from "../CONSTANTS/API_ENDPOINTS";
import type { CustomResponse } from "../Types/ApiTypes";
import type { Attachment } from "../Types/Attachment.types";
import HttpService from "./HttpService";

class AttachmentService {

  static async getByTableAndId(
    tableName: string,
    recordId: number | string
  ): Promise<Attachment[]> {

    const response: CustomResponse<Attachment[]> = await HttpService.callApi(
      API_ENDPOINTS.ATTACHMENT.GET_BY_TABLE_AND_ID(tableName, Number(recordId)),
      "GET"
    );

    return response.value || [];
  }
  
  static async getById(
    attachmentId: number
  ): Promise<CustomResponse<Attachment>> {
    const response: CustomResponse<Attachment> = await HttpService.callApi(
      API_ENDPOINTS.ATTACHMENT.GET_BY_ID(attachmentId),
      "GET"
    );

    return response;
  }

  static async deleteAttachment(
    attachmentId: number,
    deletedBy: string
  ): Promise<null> {

    const response: CustomResponse<null> = await HttpService.callApi(
      `${API_ENDPOINTS.ATTACHMENT.DELETE(attachmentId)}?deletedBy=${deletedBy}`,
      "DELETE"
    );

    return response.value;
  }

  static async uploadAttachment(formData: FormData) {
    return HttpService.callApi(
      API_ENDPOINTS.ATTACHMENT.UPLOAD,
      "POST",
      formData,
      false,
      true
    );
  }

  static async downloadAttachment(attachmentId: number, fileName: string) {
    return HttpService.downloadFile(
      API_ENDPOINTS.ATTACHMENT.DOWNLOAD(attachmentId),
      fileName
    );
  }

  static async updateAttachment(
    attachmentId: number,
    data: Partial<Attachment>
  ): Promise<Attachment> {
    
    const cleanData = Object.fromEntries(
      Object.entries(data).filter(([_, value]) => 
        value !== undefined && 
        value !== null && 
        value !== ''
      )
    );

    console.log('🔍 Update Attachment ID:', attachmentId);
    console.log('🔍 Cleaned Update Data:', cleanData);
    console.log('🔍 Endpoint:', API_ENDPOINTS.ATTACHMENT.UPDATE(attachmentId));

    const response: CustomResponse<Attachment> = await HttpService.callApi(
      API_ENDPOINTS.ATTACHMENT.UPDATE(attachmentId),
      "PUT",
      cleanData
    );
    return response.value;
  }
}

export default AttachmentService;