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
  async getStateById(id: number): Promise<State> {
    const response = await HttpService.callApi<CustomResponse<State>>(
      API_ENDPOINTS.STATE.GET_BY_ID(id),
      "GET"
    );
    return response.value;
  },

  // Create state
  async createState(payload: Partial<State>): Promise<State> {
    const response = await HttpService.callApi<CustomResponse<State>>(
      API_ENDPOINTS.STATE.CREATE,
      "POST",
      payload
    );
    return response.value;
  },

  // Update state
  async updateState(id: number, payload: Partial<State>): Promise<State> {
    const response = await HttpService.callApi<CustomResponse<State>>(
      API_ENDPOINTS.STATE.UPDATE(id),
      "PUT",
      payload
    );
    return response.value;
  },

  // Delete state
  async deleteState(id: number): Promise<boolean> {
    const response = await HttpService.callApi<CustomResponse<boolean>>(
      API_ENDPOINTS.STATE.DELETE(id),
      "DELETE"
    );
    return response.value;
  }
};

export default StateService;
