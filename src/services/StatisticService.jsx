import axios from "axios";
import { API_HOST } from "./APIConfig";

const statisticOfRegisterNotebook = async (accessToken, schoolYear) => {
  const res = await axios.get(`${API_HOST}/Statistics/Schedule?schoolYear=${schoolYear}`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
  });
  console.log(res.data);
  return res.data;
};

export { statisticOfRegisterNotebook };
