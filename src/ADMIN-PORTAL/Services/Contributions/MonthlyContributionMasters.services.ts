import { API_ENDPOINTS } from "../../../CONSTANTS/API_ENDPOINTS";
import HttpService from "../../../Services/Http.services";
import type { CustomResponse } from "../../../Types/ApiTypes";
import type { ContributionDetail, 
  ContributionDetailPaginatedResponse, 
  ContributionDetailParams, 
  ContributionReportParams, 
  ContributionUpdatePayload, 
  ContributionUpdateResponse, 
  ContributionUploadPayload, 
  ContributionUploadResponse, 
  MonthlyContributionMaster} from "../../Types/Contributions/MonthlyContributionMasters.types";

export default class MonthlyContributionMasterService {

  static async uploadAndSave(
  payload: ContributionUploadPayload
): Promise<ContributionUploadResponse> {
  const formData = new FormData();
  formData.append("MonthCode",        String(payload.MonthCode));
  formData.append("YearOf",           String(payload.YearOf));
  formData.append("ContributionFile", payload.ContributionFile);

  const response = await HttpService.callApi<CustomResponse<ContributionUploadResponse>>(
    API_ENDPOINTS.MONTHLY_CONTRIBUTION_MASTERS.CREATE,
    "POST",
    formData,
    false,
    true
  );

  if (!response.isSucess && !response.isSuccess) {
    throw new Error(response.customMessage || response.error || "Upload failed");
  }

  return response.value;
}

  static async getAll(): Promise<MonthlyContributionMaster[]> {
    const response = await HttpService.callApi<CustomResponse<MonthlyContributionMaster[]>>(
      API_ENDPOINTS.MONTHLY_CONTRIBUTION_MASTERS.GET_ALL,
      "GET"
    );

    const result = response?.value ?? response;
    return Array.isArray(result) ? result : [];
  }

  static async getById(
    params: ContributionDetailParams
  ): Promise<ContributionDetailPaginatedResponse> {
    const {
      id,
      PageNumber    = 1,
      PageSize      = 10,
      GetAll        = false,
      StaffNo,
      Name,
      DpCode,
      IsParked,
      SearchTerm,
      SortBy,
      SortDescending,
    } = params;

    const query = new URLSearchParams();
    query.append("PageNumber",    String(PageNumber));
    query.append("PageSize",      String(PageSize));
    query.append("GetAll",        String(GetAll));
    if (StaffNo       !== undefined) query.append("StaffNo",       StaffNo);
    if (Name          !== undefined) query.append("Name",          Name);
    if (DpCode        !== undefined) query.append("DpCode",        DpCode);
    if (IsParked      !== undefined) query.append("IsParked",      String(IsParked));
    if (SearchTerm    !== undefined) query.append("SearchTerm",    SearchTerm);
    if (SortBy        !== undefined) query.append("SortBy",        SortBy);
    if (SortDescending !== undefined) query.append("SortDescending", String(SortDescending));

    const url = `${API_ENDPOINTS.MONTHLY_CONTRIBUTION_MASTERS.GET_BY_ID(id)}?${query.toString()}`;

    const response = await HttpService.callApi<CustomResponse<ContributionDetailPaginatedResponse>>(
      url,
      "GET"
    );

    const result = response?.value ?? response;

    return {
      data:         result?.data         ?? [],
      totalRecords: result?.totalRecords ?? 0,
      pageNumber:   result?.pageNumber   ?? PageNumber,
      pageSize:     result?.pageSize     ?? PageSize,
      totalPages:   result?.totalPages   ?? 1,
      hasPrevious:  result?.hasPrevious  ?? false,
      hasNext:      result?.hasNext      ?? false,
    };
  }

  static async getAllDetails(id: number): Promise<ContributionDetail[]> {
    const result = await MonthlyContributionMasterService.getById({
      id,
      GetAll:    true,
      PageNumber: 1,
      PageSize:   99999,
    });
    return result.data;
  }

static async getReport(
  params: ContributionReportParams
): Promise<ContributionDetailPaginatedResponse> {
  const {
    id,
    reportType,
    pageNumber = 1,
    pageSize   = 10,
  } = params;

  const query = new URLSearchParams();
  query.append("type",       reportType);   
  query.append("pageNumber", String(pageNumber));
  query.append("pageSize",   String(pageSize));

  const url = `${API_ENDPOINTS.MONTHLY_CONTRIBUTION_MASTERS.GET_BY_REPORT(id)}?${query.toString()}`;

  const response = await HttpService.callApi<CustomResponse<ContributionDetailPaginatedResponse>>(
    url,
    "GET"
  );

  const result = response?.value ?? response;

  return {
    data:         result?.data         ?? [],
    totalRecords: result?.totalRecords ?? 0,
    pageNumber:   result?.pageNumber   ?? pageNumber,
    pageSize:     result?.pageSize     ?? pageSize,
    totalPages:   result?.totalPages   ?? 1,
    hasPrevious:  result?.hasPrevious  ?? false,
    hasNext:      result?.hasNext      ?? false,
  };
}

static async update(
  payload: ContributionUpdatePayload
): Promise<ContributionUpdateResponse> {
  const formData = new FormData();
  formData.append("MonthCode",        String(payload.MonthCode));
  formData.append("YearOf",           String(payload.YearOf));
  formData.append("ContributionFile", payload.ContributionFile);

  const response = await HttpService.callApi<CustomResponse<ContributionUpdateResponse>>(
    API_ENDPOINTS.MONTHLY_CONTRIBUTION_MASTERS.UPDATE(payload.id),
    "PUT",
    formData,
    false,
    true
  );

  if (!response.isSucess && !response.isSuccess) {
    throw new Error(response.customMessage || response.error || "Update failed");
  }

  return response.value;
}

}