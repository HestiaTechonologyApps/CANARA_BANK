import { API_ENDPOINTS } from "../../../CONSTANTS/API_ENDPOINTS";
import AuthService from "../../../Services/Auth.services";
import HttpService from "../../../Services/HttpService";
import type { CustomResponse } from "../../../Types/ApiTypes";
import type { MonthlyContribution, MonthlyContributionUploadResponse } from "../../Types/Contributions/MonthlyContribution.types";

const MonthlyContributionService = {

  async getAllMonthlyContributions(): Promise<MonthlyContribution[]> {
    const response = await HttpService.callApi<CustomResponse<MonthlyContribution[]>>(
      API_ENDPOINTS.MONTHLY_CONTRIBUTION.GET_ALL,
      "GET"
    );
    return response.value;
  },

  async getMonthlyContributionById(id: number): Promise<CustomResponse<MonthlyContribution>> {
    const response = await HttpService.callApi<CustomResponse<MonthlyContribution>>(
      API_ENDPOINTS.MONTHLY_CONTRIBUTION.GET_BY_ID(id),
      "GET"
    );
    return response;
  },

  async createMonthlyContribution(
    data: Omit<MonthlyContribution, "monthlyContributionId" | "auditLogs">
  ): Promise<MonthlyContribution> {
    const response = await HttpService.callApi<CustomResponse<MonthlyContribution>>(
      API_ENDPOINTS.MONTHLY_CONTRIBUTION.CREATE,
      "POST",
      data
    );
    return response.value;
  },

  async updateMonthlyContribution(
    id: number,
    data: Partial<Omit<MonthlyContribution, "monthlyContributionId" | "auditLogs">>
  ): Promise<MonthlyContribution> {
    const response = await HttpService.callApi<CustomResponse<MonthlyContribution>>(
      API_ENDPOINTS.MONTHLY_CONTRIBUTION.UPDATE(id),
      "PUT",
      data
    );
    return response.value;
  },

  async deleteMonthlyContribution(id: number): Promise<void> {
    await HttpService.callApi<CustomResponse<void>>(
      API_ENDPOINTS.MONTHLY_CONTRIBUTION.DELETE(id),
      "DELETE"
    );
  },

  // ✅ File Upload (same pattern as Member profile upload)
  // async uploadFile(file: File, monthlyContributionId: number): Promise<string> {
  //   const formData = new FormData();
  //   formData.append("MonthlyContributionId", monthlyContributionId.toString());
  //   formData.append("File", file);

  //   const response = await fetch(API_ENDPOINTS.MONTHLY_CONTRIBUTION.UPLOAD_FILE, {
  //     method: "POST",
  //     body: formData,
  //   });

  //   if (!response.ok) {
  //     const err = await response.text();
  //     throw new Error(err || "File upload failed");
  //   }

  //   const result = await response.json();
  //   return result.value || result.filePath || "";
  // },

  /**
   * Upload Monthly Contribution File
   * @param file - The file to upload
   * @param monthCode - Month code (integer)
   * @param yearOf - Year (integer)
   * @returns Promise with upload response
   */
  async uploadFile(
    file: File,
    monthCode: number,
    yearOf: number
  ): Promise<MonthlyContributionUploadResponse> {
    try {
      const formData = new FormData();
      
      // Match the API parameter names from backend
      formData.append('ContributionFile', file);
      formData.append('MonthCode', monthCode.toString());
      formData.append('YearOf', yearOf.toString());

      console.log('Uploading contribution file:', {
        name: file.name,
        size: file.size,
        type: file.type,
        monthCode,
        yearOf,
      });

      const token = AuthService.getToken();
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch(API_ENDPOINTS.MONTHLY_CONTRIBUTION.UPLOAD_FILE, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          // Do NOT set Content-Type - browser sets it automatically with boundary
        },
        body: formData,
      });

      console.log('Upload response:', {
        status: response.status,
        statusText: response.statusText,
        ok: response.ok,
      });

      // Get response text first for better error debugging
      const responseText = await response.text();
      console.log('Response text:', responseText);

      if (!response.ok) {
        let errorMessage = `Upload failed: ${response.status} ${response.statusText}`;
        
        try {
          const errorData = JSON.parse(responseText);
          errorMessage = errorData.message || errorData.error || errorMessage;
        } catch {
          errorMessage = responseText || errorMessage;
        }
        
        throw new Error(errorMessage);
      }

      // Parse the successful response
      let result: MonthlyContributionUploadResponse;
      try {
        result = JSON.parse(responseText);
      } catch {
        throw new Error('Invalid response format from server');
      }

      console.log('Upload successful, result:', result);

      return result;
    } catch (error) {
      console.error('Error in uploadFile:', error);
      
      if (error instanceof Error) {
        throw new Error(`Failed to upload contribution file: ${error.message}`);
      }
      
      throw new Error('Failed to upload contribution file');
    }
  },
};



export default MonthlyContributionService;
