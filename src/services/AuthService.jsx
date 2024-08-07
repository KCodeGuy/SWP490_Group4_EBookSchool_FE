import axios from "axios";
import { API_HOST } from "./APIConfig";
export const loginUser = async ({ username, password }) => {
  try {
    const response = await fetch(`${API_HOST}/Auth/Login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    });

    const data = await response.json();
    return data;
  } catch (error) {
    return error;
  }
};

export const logoutAPI = async (accessToken) => {
  console.log("accessToken", accessToken);
  try {
    const response = await fetch(`${API_HOST}/Auth/Logout`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    });

    console.log("response", response);
    return response;
  } catch (error) {
    return error;
  }
};

export const logoutUser = () => {
  localStorage.clear();
};
