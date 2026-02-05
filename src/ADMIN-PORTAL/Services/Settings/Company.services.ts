// src/services/Settings/Company.services.ts

import { API_ENDPOINTS } from "../../../CONSTANTS/API_ENDPOINTS";
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

  // ✅ ADDED — Upload Company Logo
  async uploadCompanyLogo(file: File, companyId: number): Promise<void> {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("companyId", companyId.toString());

   await HttpService.callApi(
  API_ENDPOINTS.COMPANY.UPLOAD_FILE,
  "POST",
  formData
);

  },
};


export default CompanyService;
