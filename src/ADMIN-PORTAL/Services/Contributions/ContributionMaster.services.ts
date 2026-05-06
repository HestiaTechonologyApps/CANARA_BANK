// src/Services/Contributions/ContributionMasters.services.ts
import { API_ENDPOINTS } from "../../../CONSTANTS/API_ENDPOINTS";
import HttpService from "../../../Services/HttpService";
import type { CustomResponse } from "../../../Types/ApiTypes";
import type { ContributionMaster } from "../../Types/Contributions/MonthlyContributionMasters.types";

export default class ContributionMasterService {

  // ── Get All Masters ──────────────────────────────────────────────
  static async getAll(): Promise<ContributionMaster[]> {
    const response = await HttpService.callApi<CustomResponse<ContributionMaster[]>>(
      API_ENDPOINTS.CONTRIBUTION_MASTER.GET_ALL,
      "GET"
    );

    const result = response?.value ?? response;
    return Array.isArray(result) ? result : [];
  }

  // ── Get Master by ID ─────────────────────────────────────────────
  static async getById(masterId: number): Promise<ContributionMaster> {
    const response = await HttpService.callApi<CustomResponse<ContributionMaster>>(
      API_ENDPOINTS.CONTRIBUTION_MASTER.GET_MASTER_ID(masterId),
      "GET"
    );

    return response?.value ?? response;
  }

  // ── Delete Master ────────────────────────────────────────────────
  static async delete(masterId: number): Promise<void> {
    await HttpService.callApi<CustomResponse<void>>(
      API_ENDPOINTS.CONTRIBUTION_MASTER.DELETE(masterId),
      "DELETE"
    );
  }

  // ── Forward Master ───────────────────────────────────────────────
  static async forward(masterId: number): Promise<ContributionMaster> {
    const response = await HttpService.callApi<CustomResponse<ContributionMaster>>(
      API_ENDPOINTS.CONTRIBUTION_MASTER.FORWARD(masterId),
      "POST"
    );

    return response?.value ?? response;
  }

}