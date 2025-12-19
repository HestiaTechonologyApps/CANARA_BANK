import { API_ENDPOINTS } from "../../../CONSTANTS/API_ENDPOINTS";
import HttpService from "../../../Services/HttpService";
import type { CustomResponse } from "../../../Types/ApiTypes";
import type { State } from "../../Types/Settings/States.types";


const StateService = {
  // Get all states
  async getAllStates(): Promise<State[]> {
    const response = await HttpService.callApi<CustomResponse<State[]>>(
      API_ENDPOINTS.STATE.GET_ALL,
      "GET"
    );
    return response.value;
  },

  // Get state by ID
  async getStateById(id: number): Promise<CustomResponse<State>> {
    const response = await HttpService.callApi<CustomResponse<State>>(
      API_ENDPOINTS.STATE.GET_BY_ID(id),
      "GET"
    );
    return response;
  },

  // Create state
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

  // Update state
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

  // Delete state
  async deleteState(id: number): Promise<void> {
    await HttpService.callApi<CustomResponse<void>>(
      API_ENDPOINTS.STATE.DELETE(id),
      "DELETE"
    );
  },
};

export default StateService;
