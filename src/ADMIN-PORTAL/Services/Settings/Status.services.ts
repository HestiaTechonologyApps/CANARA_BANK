import { API_ENDPOINTS } from "../../../CONSTANTS/API_ENDPOINTS";
import HttpService from "../../../Services/HttpService";
import type { CustomResponse } from "../../../Types/ApiTypes";
import type { Status } from "../../Types/Settings/Status.types";

const StatusService = {
  async getAllStatuses(): Promise<Status[]> {
    const response = await HttpService.callApi<CustomResponse<Status[]>>(
      API_ENDPOINTS.STATUS.GET_ALL,
      'GET'
    );
    return response.value;
  },

  async getStatusById(id: number): Promise<CustomResponse<Status>> {
    const response = await HttpService.callApi<CustomResponse<Status>>(
      API_ENDPOINTS.STATUS.GET_BY_ID(id),
      'GET'
    );
    return response; 
  },

  async createStatus(data: Omit<Status, 'statusId'>): Promise<Status> {
    const response = await HttpService.callApi<CustomResponse<Status>>(
      API_ENDPOINTS.STATUS.CREATE,
      'POST',
      data
    );
    return response.value;
  },

  async updateStatus(id: number, data: Partial<Omit<Status, 'statusId'>>): Promise<void> {
  await HttpService.callApi<CustomResponse<void>>(
    API_ENDPOINTS.STATUS.UPDATE(id),
    'PUT',
    data
  );
},

  async deleteStatus(id: number): Promise<void> {
    await HttpService.callApi<CustomResponse<void>>(
      API_ENDPOINTS.STATUS.DELETE(id),
      'DELETE'
    );
  },
};

export default StatusService;