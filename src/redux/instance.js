import axios from "axios";

// base url to make requests to the database
const API_BASE_URL = "https://100014.pythonanywhere.com";

export const instance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 5000, // 5 seconds
});

export const postData = async (endpoint, data) => {
  try {
    const response = await instance.post(endpoint, data);
    if (response?.data.msg === "success") {
      console.log("Password-succ", response?.data.info);
      return response?.data.info;
    }
  } catch (error) {
    console.log("Password-Error", error.response?.data.info);
    throw new Error(error.response?.data.info);
  }
};
