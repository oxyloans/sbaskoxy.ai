import axios from 'axios';
import BASE_URL from "../Config";

/**
 * Check if the user profile is complete by fetching profile data from API
 * @param {string} customerId - The customer ID
 * @param {string} token - The authentication token
 * @returns {Promise<boolean>} - Whether profile is complete or not
 */
export default async function checkProfileCompletion(customerId: string, token: string): Promise<boolean> {
  if (!customerId || !token) {
    console.error("Missing customerId or token");
    return false;
  }
  
  try {
    const response = await axios({
      method: "GET",
      url: `${BASE_URL}/user-service/customerProfileDetails?customerId=${customerId}`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    
    if (response.status === 200) {
      const profileData = response.data;
      
      return !!(
        profileData.firstName &&
        profileData.firstName !== "" &&
        profileData.firstName !== null 
        // profileData.mobileNumber &&
        // profileData.mobileNumber !== "" &&
        // profileData.mobileNumber !== null
      );
    }
    return false;
  } catch (error) {
    console.error("Error checking profile completion:", error);
    return false;
  }
}