import axios from "axios";
import { API_HOST } from "./APIConfig";
export const loginUser = async (data) => {
  // console.log("accessToken", accessToken);
  console.log(data);
  try {
    const response = await axios.post(`${API_HOST}/Auth/Login`, data, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    console.log("response", response);
    return response;
  } catch (error) {
    return error;
  }
};

export const logoutAPI = async (accessToken) => {
  // console.log("accessToken", accessToken);
  try {
    const response = await fetch(`${API_HOST}/Auth/Logout`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    });

    // console.log("response", response);
    return response;
  } catch (error) {
    return error;
  }
};

export const logoutUser = () => {
  localStorage.clear();
};
