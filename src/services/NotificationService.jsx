import axios from "axios";
import { API_HOST } from "./APIConfig";

const getAllNotifications = async (accessToken) => {
  // console.log(accessToken);
  try {
    const res = await axios.get(`${API_HOST}/Notifications`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return res.data;
  } catch (error) {
    return error;
  }
};

const getNotificationByID = async (accessToken, notificationID) => {
  try {
    const res = await axios.get(`${API_HOST}/Notifications/${notificationID}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return res.data;
  } catch (error) {
    return error;
  }
};

const addNotification = async (accessToken, data) => {
  const formData = new FormData();
  formData.append("title", data.title);
  formData.append("thumbnail", data.thumbnail);
  formData.append("content", data.content);

  try {
    const res = await axios.post(`${API_HOST}/Notifications`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return res;
  } catch (error) {
    return error;
  }
};

const updateNotification = async (accessToken, data) => {
  const formData = new FormData();
  formData.append("title", data.title);
  formData.append("thumbnail", data.thumbnail);
  formData.append("content", data.content);

  try {
    const res = await axios.put(`${API_HOST}/Notifications/${data.id}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${accessToken}`,
      },
    });

    return res;
  } catch (error) {
    return error;
  }
};

const deleteNotification = async (accessToken, notificationID) => {
  try {
    const res = await axios.delete(`${API_HOST}/Notifications/${notificationID}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return res;
  } catch (error) {
    return error;
  }
};

export {
  getAllNotifications,
  addNotification,
  updateNotification,
  deleteNotification,
  getNotificationByID,
};
