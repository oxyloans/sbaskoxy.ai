export interface ProfileData {
    userFirstName?: string;
    userLastName?: string;
    customerEmail?: string;
    alterMobileNumber?: string;
  }
  
  export const isProfileComplete = (profileData: ProfileData | null): boolean => {
    if (!profileData) return false;
    
    return !!(
      profileData.userFirstName?.trim() &&
      profileData.userLastName?.trim() &&
      profileData.customerEmail?.trim() &&
      profileData.alterMobileNumber?.trim()
    );
  };