// src/ADMIN-PORTAL/Services/Member/Member.services.ts
import { API_ENDPOINTS } from "../../../CONSTANTS/API_ENDPOINTS";
import HttpService from "../../../Services/HttpService";
import type { CustomResponse } from "../../../Types/ApiTypes";
import type { Member } from "../../Types/Contributions/Member.types";


const MemberService = {
  async getAllMembers(): Promise<Member[]> {
    const response = await HttpService.callApi<CustomResponse<Member[]>>(
      API_ENDPOINTS.MEMBER.GET_ALL,
      "GET"
    );
    return response.value;
  },

  async getMemberById(id: number): Promise<CustomResponse<Member>> {
    const response = await HttpService.callApi<CustomResponse<Member>>(
      API_ENDPOINTS.MEMBER.GET_BY_ID(id),
      "GET"
    );
   
    return response;
  },

  async createMember(
    data: Omit<Member, "memberId" | "auditLogs">
  ): Promise<Member> {
    const response = await HttpService.callApi<CustomResponse<Member>>(
      API_ENDPOINTS.MEMBER.CREATE,
      "POST",
      data
    );
    return response.value;
  },

  async updateMember(
    id: number,
    data: Partial<Omit<Member, "memberId" | "auditLogs">>
  ): Promise<Member> {
    const response = await HttpService.callApi<CustomResponse<Member>>(
      API_ENDPOINTS.MEMBER.UPDATE(id),
      "PUT",
      data
    );
    return response.value;
  },

  async deleteMember(id: number): Promise<void> {
    await HttpService.callApi<CustomResponse<void>>(
      API_ENDPOINTS.MEMBER.DELETE(id),
      "DELETE"
    );
  },
};

export default MemberService;
