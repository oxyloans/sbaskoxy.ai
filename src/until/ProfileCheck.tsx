import axios from "axios";
import BASE_URL from "../Config";

/**
 * Check if the user profile is complete by fetching profile data from API
 * @param {string} customerId - The customer ID
 * @param {string} token - The authentication token
 * @returns {Promise<boolean>} - Whether profile is complete or not
 */
export default function checkProfileCompletion() {
  const profileData = localStorage.getItem("profileData");
  // console.log("profileData", profileData);

  if (profileData) {
    const parsedData = JSON.parse(profileData);
    //   console.log("parsedData", parsedData);
    return !!(
      (
        parsedData.userFirstName &&
        parsedData.userFirstName != "" &&
        parsedData.userFirstName !== null
      )
      // parsedData.userLastName &&
      // parsedData.userLastName != "" &&
      // parsedData.userLastName !== null &&
      // parsedData.customerEmail &&
      // parsedData.customerEmail != "" &&
      // parsedData.customerEmail !== null &&
      // parsedData.alterMobileNumber &&
      // parsedData.alterMobileNumber != " " &&
      // parsedData.alterMobileNumber !== null
    );
  }
  return false;
}
