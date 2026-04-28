// src/ADMIN-PORTAL/Services/Dashboard/Dashboard.services.ts

import { API_ENDPOINTS } from "../../../CONSTANTS/API_ENDPOINTS";
import HttpService from "../../../Services/HttpService";
import type { CustomResponse } from "../../../Types/ApiTypes";
import type {
  DashboardData,
  DashboardOverview,
  MonthlyContributionVsClaims,
  ClaimTypeDistribution,
  StateWiseMembership,
  TopPerformingState,
  RecentActivity,
  MonthlyFinancialComparison,
  ContributionTrend,
} from "../../Types/Dashboard/Dashboard.types";

const DashboardService = {
  // ✅ year param appended as query string — e.g. /Dashboard?year=2025
  getAll: async (year: number): Promise<DashboardData> => {
    const response = await HttpService.callApi<CustomResponse<DashboardData>>(
      `${API_ENDPOINTS.DASHBOARD.GET_ALL}?year=${year}`,
      "GET"
    );
    return response.value;
  },

  getOverview: async (year: number): Promise<DashboardOverview> => {
    const response = await HttpService.callApi<CustomResponse<DashboardOverview>>(
      `${API_ENDPOINTS.DASHBOARD.GET_OVERVIEW}?year=${year}`,
      "GET"
    );
    return response.value;
  },

  getMonthlyContributionVsClaims: async (year: number): Promise<MonthlyContributionVsClaims[]> => {
    const response = await HttpService.callApi<CustomResponse<MonthlyContributionVsClaims[]>>(
      `${API_ENDPOINTS.DASHBOARD.GET_MONTHLY_CONTRIBUTION}?year=${year}`,
      "GET"
    );
    return response.value;
  },

  getClaimTypeDistribution: async (year: number): Promise<ClaimTypeDistribution> => {
    const response = await HttpService.callApi<CustomResponse<ClaimTypeDistribution>>(
      `${API_ENDPOINTS.DASHBOARD.GET_CLAIM}?year=${year}`,
      "GET"
    );
    return response.value;
  },

  getStateWiseMembership: async (year: number): Promise<StateWiseMembership[]> => {
    const response = await HttpService.callApi<CustomResponse<StateWiseMembership[]>>(
      `${API_ENDPOINTS.DASHBOARD.GET_STATE}?year=${year}`,
      "GET"
    );
    return response.value;
  },

  getTopPerformingStates: async (year: number): Promise<TopPerformingState[]> => {
    const response = await HttpService.callApi<CustomResponse<TopPerformingState[]>>(
      `${API_ENDPOINTS.DASHBOARD.GET_TOP_PERFORMING}?year=${year}`,
      "GET"
    );
    return response.value;
  },

  getRecentActivities: async (year: number): Promise<RecentActivity[]> => {
    const response = await HttpService.callApi<CustomResponse<RecentActivity[]>>(
      `${API_ENDPOINTS.DASHBOARD.GET_RECENT_ACTIVITIES}?year=${year}`,
      "GET"
    );
    return response.value;
  },

  getMonthlyFinancialComparison: async (year: number): Promise<MonthlyFinancialComparison[]> => {
    const response = await HttpService.callApi<CustomResponse<MonthlyFinancialComparison[]>>(
      `${API_ENDPOINTS.DASHBOARD.GET_FINANCIAL}?year=${year}`,
      "GET"
    );
    return response.value;
  },

  getContributionTrends: async (year: number): Promise<ContributionTrend[]> => {
    const response = await HttpService.callApi<CustomResponse<ContributionTrend[]>>(
      `${API_ENDPOINTS.DASHBOARD.GET_CONTRIBUTION}?year=${year}`,
      "GET"
    );
    return response.value;
  },
};

export default DashboardService;