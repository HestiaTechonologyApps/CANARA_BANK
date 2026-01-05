// src/services/Settings/CircleState.services.ts

import { API_ENDPOINTS } from "../../../CONSTANTS/API_ENDPOINTS";
import HttpService from "../../../Services/HttpService";
import type { CustomResponse } from "../../../Types/ApiTypes";
import type { CircleState } from "../../Types/Settings/CircleState.types";

const CircleStateService = {

  async getAllCircleStates(): Promise<CircleState[]> {
    const response = await HttpService.callApi<CustomResponse<CircleState[]>>(
      API_ENDPOINTS.CIRCLE_STATE.GET_ALL,
      "GET"
    );
    return response.value;
  },

  async getCircleStateById(id: number): Promise<CustomResponse<CircleState>> {
    const response = await HttpService.callApi<CustomResponse<CircleState>>(
      API_ENDPOINTS.CIRCLE_STATE.GET_BY_ID(id),
      "GET"
    );
  
    return response;
  },

  async createCircleState(
    data: Omit<CircleState, "auditLogs">
  ): Promise<CircleState> {
    const response = await HttpService.callApi<CustomResponse<CircleState>>(
      API_ENDPOINTS.CIRCLE_STATE.CREATE,
      "POST",
      data
    );
    return response.value;
  },

  async updateCircleState(
    id: number,
    data: Partial<Omit<CircleState, "auditLogs">>
  ): Promise<CircleState> {
    const response = await HttpService.callApi<CustomResponse<CircleState>>(
      API_ENDPOINTS.CIRCLE_STATE.UPDATE(id),
      "PUT",
      data
    );
    return response.value;
  },

  async deleteCircleState(id: number): Promise<void> {
    await HttpService.callApi<CustomResponse<void>>(
      API_ENDPOINTS.CIRCLE_STATE.DELETE(id),
      "DELETE"
    );
  },
};

export default CircleStateService;
