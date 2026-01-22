import { API_ENDPOINTS } from "../../../CONSTANTS/API_ENDPOINTS";
import HttpService from "../../../Services/HttpService";
import AuthService from "../../../Services/Auth.services";
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

  async getManagingCommitteeById(
    id: number
  ): Promise<CustomResponse<ManagingCommittee>> {
    return HttpService.callApi<CustomResponse<ManagingCommittee>>(
      API_ENDPOINTS.MANAGING_COMMITTEE.GET_BY_ID(id),
      "GET"
    );
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
    data: Omit<ManagingCommittee, "auditLogs">
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

  // ========================= UPLOAD IMAGE =========================
  async uploadManagingCommitteeImage(file: File, managingComiteeId?: number): Promise<string> {
    try {
      const formData = new FormData();

      // If id not passed, use 0 (or remove if backend doesn't require id)
      const idToUse = managingComiteeId ?? 0;

      // ⚠️ Match backend DTO parameter names exactly
      formData.append("ManagingComiteeId", idToUse.toString());
      formData.append("Image", file); // change key if backend expects different name

      const token = AuthService.getToken();
      if (!token) {
        throw new Error("No authentication token found");
      }

      const response = await fetch(API_ENDPOINTS.MANAGING_COMMITTEE.UPLOAD_IMAGE, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          // ❗ DO NOT set Content-Type for FormData
        },
        body: formData,
      });

      const responseText = await response.text();

      if (!response.ok) {
        let errorMessage = `Upload failed: ${response.status}`;
        try {
          const errorData = JSON.parse(responseText);
          errorMessage = errorData.message || errorData.error || errorMessage;
        } catch {
          errorMessage = responseText || errorMessage;
        }
        throw new Error(errorMessage);
      }

      let result: any;
      try {
        result = JSON.parse(responseText);
      } catch {
        result = responseText;
      }

      // Handle different response formats
      if (typeof result === "object") {
        return (
          result.value ||
          result.fileName ||
          result.filePath ||
          result.path ||
          result.url ||
          ""
        );
      }

      return result || "";
    } catch (error) {
      console.error("Error in uploadManagingCommitteeImage:", error);
      if (error instanceof Error) {
        throw new Error(`Failed to upload image: ${error.message}`);
      }
      throw new Error("Failed to upload image");
    }
  },
};

export default ManagingCommitteeService;
