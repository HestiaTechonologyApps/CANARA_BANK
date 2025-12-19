import { API_ENDPOINTS } from "../../../CONSTANTS/API_ENDPOINTS";
import HttpService from "../../../Services/HttpService";
import type { CustomResponse } from "../../../Types/ApiTypes";
import type { Circle } from "../../Types/Settings/Circle.types";

const CircleService = {
  async getAllCircles(): Promise<Circle[]> {
    const response = await HttpService.callApi<CustomResponse<Circle[]>>(
      API_ENDPOINTS.CIRCLE.GET_ALL,
      "GET"
    );
    return response.value;
  },

  async getCircleById(id: number): Promise<Circle> {
    const response = await HttpService.callApi<CustomResponse<Circle>>(
      API_ENDPOINTS.CIRCLE.GET_BY_ID(id),
      "GET"
    );
    return response.value;
  },

  async createCircle(
    data: Omit<Circle, "circleId" | "auditLogs" | "state">
  ): Promise<Circle> {
    const response = await HttpService.callApi<CustomResponse<Circle>>(
      API_ENDPOINTS.CIRCLE.CREATE,
      "POST",
      data
    );
    return response.value;
  },

  async updateCircle(
    id: number,
    data: Partial<Omit<Circle, "circleId" | "auditLogs" | "state">>
  ): Promise<Circle> {
    const response = await HttpService.callApi<CustomResponse<Circle>>(
      API_ENDPOINTS.CIRCLE.UPDATE(id),
      "PUT",
      data
    );
    return response.value;
  },

  async deleteCircle(id: number): Promise<void> {
    await HttpService.callApi<CustomResponse<void>>(
      API_ENDPOINTS.CIRCLE.DELETE(id),
      "DELETE"
    );
  }
};

export default CircleService;
