// src/Services/Contributions/Member.services.ts
import { API_ENDPOINTS } from "../../../CONSTANTS/API_ENDPOINTS";
import AuthService from "../../../Services/Auth.services";
import HttpService from "../../../Services/HttpService";
import { createPaginatedService } from "../../../Services/PaginationService"; // ✅ Import helper
import type { CustomResponse } from "../../../Types/ApiTypes";
import type { Member } from "../../Types/Contributions/Member.types";

const MemberService = {
  
  async getAllMembers(): Promise<Member[]> {
    try {
      const response = await HttpService.callApi<CustomResponse<Member[]>>(
        API_ENDPOINTS.MEMBER.GET_ALL,
        "GET"
      );
      return response.value || [];
    } catch (error) {
      console.error('Error fetching all members:', error);
      return [];
    }
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

 
  async uploadProfilePicture(file: File, memberId?: number): Promise<string> {
    try {
      
      if (!file) {
        throw new Error('No file provided');
      }

      const maxFileSize = 2 * 1024 * 1024;
      if (file.size > maxFileSize) {
        throw new Error('File size exceeds 2MB. Please choose a smaller image.');
      }

      const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
      if (!allowedTypes.includes(file.type)) {
        throw new Error('Only image files (JPG, PNG, GIF, WEBP) are allowed.');
      }

      
      const memberIdToUse = memberId || AuthService.getMemberId();
      
      if (!memberIdToUse) {
        throw new Error('Member ID is required for profile picture upload');
      }

      
      const formData = new FormData();
      formData.append('MemberId', memberIdToUse.toString());
      formData.append('ProfilePic', file);

      console.log('📤 Uploading profile picture:', {
        memberId: memberIdToUse,
        fileName: file.name,
        fileSize: `${(file.size / 1024).toFixed(2)} KB`,
        fileType: file.type,
        lastModified: new Date(file.lastModified).toISOString()
      });

      
      const token = AuthService.getToken();
      if (!token) {
        throw new Error('No authentication token found. Please log in again.');
      }

    
      const response = await fetch(API_ENDPOINTS.MEMBER.UPLOAD_PROFILE_PIC, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          
        },
        body: formData,
      });

      console.log('📥 Upload response:', {
        status: response.status,
        statusText: response.statusText,
        ok: response.ok,
      });

      
      const responseText = await response.text();
      console.log('📄 Response text:', responseText);

      
      if (!response.ok) {
        let errorMessage = `Upload failed: ${response.status} ${response.statusText}`;
        
        try {
          const errorData = JSON.parse(responseText);
          errorMessage = errorData.error || errorData.message || errorMessage;
        } catch {
          errorMessage = responseText || errorMessage;
        }
        
        throw new Error(errorMessage);
      }

      
      let result;
      try {
        result = JSON.parse(responseText);
      } catch {
        
        result = responseText;
      }

      console.log('✅ Upload successful:', result);

      
      let filePath = '';
      
      if (typeof result === 'object' && result !== null) {
      
        filePath = result.value || 
                   result.fileName || 
                   result.filePath || 
                   result.path || 
                   result.url || 
                   result.data || 
                   result.profileImageSrc ||
                   '';
      } else if (typeof result === 'string') {
        filePath = result;
      }

      if (!filePath) {
        console.warn('⚠️ No file path returned from server');
      }

      return filePath;

    } catch (error) {
      console.error('❌ Error uploading profile picture:', error);
      
      if (error instanceof Error) {
        throw new Error(`Failed to upload profile picture: ${error.message}`);
      }
      
      throw new Error('Failed to upload profile picture. Please try again.');
    }
  },


  getMembersPaginated: createPaginatedService<Member>(API_ENDPOINTS.MEMBER.GET_ALL_PAGINETED),

};

export default MemberService;