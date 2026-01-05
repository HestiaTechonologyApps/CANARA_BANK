import { API_ENDPOINTS } from "../../../CONSTANTS/API_ENDPOINTS";
import HttpService from "../../../Services/HttpService";
import type { CustomResponse } from "../../../Types/ApiTypes";
import type { State } from "../../Types/Settings/States.types";


const StateService = {

  async getAllStates(): Promise<State[]> {
    const response = await HttpService.callApi<CustomResponse<State[]>>(
      API_ENDPOINTS.STATE.GET_ALL,
      "GET"
    );
    return response.value;
  },

  async getStateById(id: number): Promise<CustomResponse<State>> {
    const response = await HttpService.callApi<CustomResponse<State>>(
      API_ENDPOINTS.STATE.GET_BY_ID(id),
      "GET"
    );
    return response;
  },

  async createState(
    data: Omit<State, "stateId" | "auditLogs">
  ): Promise<State> {
    const response = await HttpService.callApi<CustomResponse<State>>(
      API_ENDPOINTS.STATE.CREATE,
      "POST",
      data
    );
    return response.value;
  },

  async updateState(
    id: number,
    data: Partial<Omit<State, "stateId" | "auditLogs">>
  ): Promise<State> {
    const response = await HttpService.callApi<CustomResponse<State>>(
      API_ENDPOINTS.STATE.UPDATE(id),
      "PUT",
      data
    );
    return response.value;
  },

  async deleteState(id: number): Promise<void> {
    await HttpService.callApi<CustomResponse<void>>(
      API_ENDPOINTS.STATE.DELETE(id),
      "DELETE"
    );
  },
};

export default StateService;
