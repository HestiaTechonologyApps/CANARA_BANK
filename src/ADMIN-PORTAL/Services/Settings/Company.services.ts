// src/services/Settings/Company.services.ts

import { API_ENDPOINTS } from "../../../CONSTANTS/API_ENDPOINTS";
import AuthService from "../../../Services/Auth.services";
import HttpService from "../../../Services/HttpService";
import type { CustomResponse } from "../../../Types/ApiTypes";
import type { Company } from "../../Types/Settings/Company.types";

const CompanyService = {

  async getAllCompanies(): Promise<Company[]> {
    const response = await HttpService.callApi<CustomResponse<Company[]>>(
      API_ENDPOINTS.COMPANY.GET_ALL,
      "GET"
    );
    return response.value;
  },

  async getCompanyById(id: number): Promise<CustomResponse<Company>> {
    const response = await HttpService.callApi<CustomResponse<Company>>(
      API_ENDPOINTS.COMPANY.GET_BY_ID(id),
      "GET"
    );
    return response;
  },

  async createCompany(
    data: Omit<Company, "companyId" | "auditLogs">
  ): Promise<Company> {
    const response = await HttpService.callApi<CustomResponse<Company>>(
      API_ENDPOINTS.COMPANY.CREATE,
      "POST",
      data
    );
    return response.value;
  },

  async updateCompany(
    id: number,
    data: Partial<Omit<Company, "companyId" | "auditLogs">>
  ): Promise<Company> {
    const response = await HttpService.callApi<CustomResponse<Company>>(
      API_ENDPOINTS.COMPANY.UPDATE(id),
      "PUT",
      data
    );
    return response.value;
  },

  async deleteCompany(id: number): Promise<void> {
    await HttpService.callApi<CustomResponse<void>>(
      API_ENDPOINTS.COMPANY.DELETE(id),
      "DELETE"
    );
  },

  /**
   * Upload company logo
   * @param file The image file to upload
   * @param companyId The ID of the company
   * @returns The uploaded file path/name
   */
  async uploadCompanyLogo(file: File, companyId: number): Promise<string> {
    try {
      const formData = new FormData();
      
      // Match the DTO parameter names from backend
      formData.append('CompanyId', companyId.toString());
      formData.append('CompanyLogo', file);

      console.log('Uploading company logo:', {
        name: file.name,
        size: file.size,
        type: file.type,
        companyId: companyId,
        lastModified: new Date(file.lastModified).toISOString()
      });

      const token = AuthService.getToken();
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch(API_ENDPOINTS.COMPANY.UPLOAD_FILE, {
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
      let result;
      try {
        result = JSON.parse(responseText);
      } catch {
        // If response is not JSON, it might be a plain string
        result = responseText;
      }

      console.log('Upload successful, result:', result);

      // Handle different possible response formats
      if (typeof result === 'object') {
        // Try different possible property names
        return result.value || 
               result.fileName || 
               result.filePath || 
               result.path || 
               result.url || 
               result.data || 
               '';
      } else if (typeof result === 'string') {
        return result;
      } else {
        console.warn('Unexpected response format:', result);
        return '';
      }
    } catch (error) {
      console.error('Error in uploadCompanyLogo:', error);
      
      if (error instanceof Error) {
        throw new Error(`Failed to upload company logo: ${error.message}`);
      }
      
      throw new Error('Failed to upload company logo');
    }
  },
};

export default CompanyService;