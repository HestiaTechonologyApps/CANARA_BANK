import { API_ENDPOINTS } from "../../../CONSTANTS/API_ENDPOINTS";
import HttpService from "../../../Services/HttpService";
import type { CustomResponse } from "../../../Types/ApiTypes";
import type { ManagingCommittee } from "../../Types/CMS/ManagingCommittee.types";


const ManagingCommitteeService = {
  async getAllManagingCommittees(): Promise<ManagingCommittee[]> {
    const response = await HttpService.callApi<CustomResponse<ManagingCommittee[]>>(
      API_ENDPOINTS.MANAGING_COMMITTEE.GET_ALL,
      "GET"
    );
    return response.value;
  },

  async getManagingCommitteeById(id: number): Promise<CustomResponse<ManagingCommittee>> {
    const response = await HttpService.callApi<CustomResponse<ManagingCommittee>>(
      API_ENDPOINTS.MANAGING_COMMITTEE.GET_BY_ID(id),
      "GET"
    );
    return response;
  },

  async createManagingCommittee(
    data: Omit<ManagingCommittee, "managingComiteeId" | "auditLogs">
  ): Promise<ManagingCommittee> {
    const response = await HttpService.callApi<CustomResponse<ManagingCommittee>>(
      API_ENDPOINTS.MANAGING_COMMITTEE.CREATE,
      "POST",
      data
    );
    return response.value;
  },

  async updateManagingCommittee(
    id: number,
    data: Partial<Omit<ManagingCommittee, "managingComiteeId" | "auditLogs">>
  ): Promise<ManagingCommittee> {
    const response = await HttpService.callApi<CustomResponse<ManagingCommittee>>(
      API_ENDPOINTS.MANAGING_COMMITTEE.UPDATE(id),
      "PUT",
      data
    );
    return response.value;
  },

  async deleteManagingCommittee(id: number): Promise<void> {
    await HttpService.callApi<CustomResponse<void>>(
      API_ENDPOINTS.MANAGING_COMMITTEE.DELETE(id),
      "DELETE"
    );
  },
};

export default ManagingCommitteeService;
