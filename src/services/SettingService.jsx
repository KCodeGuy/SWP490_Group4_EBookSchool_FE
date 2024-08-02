import axios from "axios";
import {
  API_HOST,
  LOGO_IMAGE,
  SCHOOL_SLIDER_1,
  SCHOOL_SLIDER_2,
  SCHOOL_SLIDER_3,
} from "./APIConfig";

const getSetting = async (accessToken) => {
  try {
    const res = await axios.get(`${API_HOST}/Setting`, {
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

const updateSetting = async (accessToken, data) => {
  try {
    const res = await axios.put(`${API_HOST}/Setting`, data, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    });
    if (res.status === 200) {
      localStorage.setItem("schoolSetting", JSON.stringify(data));
    }
    return res;
  } catch (error) {
    return error;
  }
};

const uploadImage = async (accessToken, data) => {
  const { file, name } = data;
  const formData = new FormData();
  formData.append("File", file);
  formData.append("Name", name);

  try {
    const res = await axios.post(`${API_HOST}/Upload`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${accessToken}`,
      },
    });
    if (res.status === 200) {
      if (name == LOGO_IMAGE) {
        localStorage.setItem("schoolLogoURL", res.data);
      }
      if (name == SCHOOL_SLIDER_1) {
        localStorage.setItem("schoolSlider1", res.data);
      }
      if (name == SCHOOL_SLIDER_2) {
        localStorage.setItem("schoolSlider2", res.data);
      }
      if (name == SCHOOL_SLIDER_3) {
        localStorage.setItem("schoolSlider3", res.data);
      }
    }
    return res;
  } catch (error) {
    return error;
  }
};

export { getSetting, updateSetting, uploadImage };
