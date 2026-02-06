import { API_ENDPOINTS } from "../../../CONSTANTS/API_ENDPOINTS";
import AuthService from "../../../Services/Auth.services";
import HttpService from "../../../Services/HttpService";
import type { CustomResponse } from "../../../Types/ApiTypes";
import type { Member, MemberPaginationParams, PaginatedResponse } from "../../Types/Contributions/Member.types";

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

  async getCurrentStaffMember(): Promise<CustomResponse<Member>> {
    const memberId = AuthService.getMemberId();
    
    if (!memberId) {
      throw new Error("Member ID not found. Please ensure you're logged in as a staff member.");
    }
    
    console.log('Fetching member details for memberId:', memberId);
    return this.getMemberById(memberId);
  },

  isCurrentUserMember(): boolean {
    const memberId = AuthService.getMemberId();
    return memberId !== null && memberId > 0;
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

  async updateCurrentStaffMember(
    data: Partial<Omit<Member, "memberId" | "auditLogs">>
  ): Promise<Member> {
    const memberId = AuthService.getMemberId();
    
    if (!memberId) {
      throw new Error("Member ID not found. Cannot update profile.");
    }
    
    console.log('Updating member profile for memberId:', memberId);
    return this.updateMember(memberId, data);
  },

  async deleteMember(id: number): Promise<void> {
    await HttpService.callApi<CustomResponse<void>>(
      API_ENDPOINTS.MEMBER.DELETE(id),
      "DELETE"
    );
  },

  /**
   * Upload profile picture for a member
   * @param file The image file to upload
   * @param memberId The ID of the member (optional, will be retrieved from auth if not provided)
   * @returns The uploaded file path/name
   */
  async uploadProfilePicture(file: File, memberId?: number): Promise<string> {
    try {
      const formData = new FormData();
      
      // Get memberId from auth service if not provided
      const memberIdToUse = memberId || AuthService.getMemberId();
      
      if (!memberIdToUse) {
        throw new Error('Member ID is required for profile picture upload');
      }
      
      // Match the DTO parameter names from backend
      formData.append('MemberId', memberIdToUse.toString());
      formData.append('ProfilePic', file);

      console.log('Uploading file:', {
        name: file.name,
        size: file.size,
        type: file.type,
        lastModified: new Date(file.lastModified).toISOString()
      });

      const token = AuthService.getToken();
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch(API_ENDPOINTS.MEMBER.UPLOAD_PROFILE_PIC, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          // Do NOT set Content-Type - browser sets it automatically with boundary
        },
        body: formData,
      });

      console.log('Upload response:', {
        status: response.status,
        statusText: response.statusText,
        ok: response.ok,
      });

      // Get response text first for better error debugging
      const responseText = await response.text();
      console.log('Response text:', responseText);

      if (!response.ok) {
        let errorMessage = `Upload failed: ${response.status} ${response.statusText}`;
        
        try {
          const errorData = JSON.parse(responseText);
          errorMessage = errorData.message || errorData.error || errorMessage;
        } catch {
          errorMessage = responseText || errorMessage;
        }
        
        throw new Error(errorMessage);
      }

      // Parse the successful response
      let result;
      try {
        result = JSON.parse(responseText);
      } catch {
        // If response is not JSON, it might be a plain string
        result = responseText;
      }

      console.log('Upload successful, result:', result);

      // Handle different possible response formats
      if (typeof result === 'object') {
        // Try different possible property names
        return result.value || 
               result.fileName || 
               result.filePath || 
               result.path || 
               result.url || 
               result.data || 
               '';
      } else if (typeof result === 'string') {
        return result;
      } else {
        console.warn('Unexpected response format:', result);
        return '';
      }
    } catch (error) {
      console.error('Error in uploadProfilePicture:', error);
      
      if (error instanceof Error) {
        throw new Error(`Failed to upload profile picture: ${error.message}`);
      }
      
      throw new Error('Failed to upload profile picture');
    }
  },

  async getMembersPaginated(params: MemberPaginationParams): Promise<{
    data: Member[];
    total: number;
  }> {
    const {
      pageNumber = 1,
      pageSize = 10,
      searchTerm = '',
      sortBy = '',
      sortOrder = 'asc'
    } = params;

    // Build query string
    const queryParams = new URLSearchParams({
      pageNumber: pageNumber.toString(),
      pageSize: pageSize.toString(),
    });

    if (searchTerm) {
      queryParams.append('searchTerm', searchTerm);
    }
    if (sortBy) {
      queryParams.append('sortBy', sortBy);
      queryParams.append('sortOrder', sortOrder);
    }

    const url = `${API_ENDPOINTS.MEMBER.GET_ALL_PAGINETED}?${queryParams.toString()}`;

    const response = await HttpService.callApi<CustomResponse<PaginatedResponse<Member>>>(
      url,
      "GET"
    );

    return {
      data: response.value.data,
      total: response.value.totalRecords
    };
  },

};

export default MemberService;