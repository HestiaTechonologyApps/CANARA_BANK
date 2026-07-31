import aibeaImg from "../Assets/Images/aibea.png"

export const getRoleAvatar = (role?: string): string | null => {
  switch (role) {
    case "SystemAdmin":
     return aibeaImg;
    case "Administrator":
    return aibeaImg;
    default:
      return null;
  }
};

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