// src/ADMIN-PORTAL/Utils/roleAvatar.ts
import sysAdminImg from "../Assets/Images/sys admin.png";
import adminImg from "../Assets/Images/admin.png";

export const getRoleAvatar = (role?: string): string | null => {
  switch (role) {
    case "SystemAdmin":
      return sysAdminImg;
    case "Administrator":
      return adminImg;
    default:
      return null;
  }
};

// Resolves the navbar avatar for all roles:
// - SystemAdmin / Administrator -> fixed role image
// - OfficeStaff with memberId  -> their uploaded profile photo
// - OfficeStaff without memberId, or DEO -> existing default image
export const getNavbarAvatar = (
  role: string | undefined,
  memberId: number | undefined,
  profileImageUrl: string | null,
  defaultImg: string
): string => {
  const roleAvatar = getRoleAvatar(role);
  if (roleAvatar) return roleAvatar;

  if (role === "OfficeStaff" && memberId && profileImageUrl) {
    return profileImageUrl;
  }

  return defaultImg;
};