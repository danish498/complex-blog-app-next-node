const { default: axios } = require("axios");

import { GET, POST } from "../../../services/APIconfig";

export const createUser = async (requestedParams) => {
  try {
    const response = await POST("/register", requestedParams);
    return response;
  } catch (error) {
    throw error;
  }
};
export const checkUsername = async (requestedParams) => {
  console.log("requestedParamsrequestedParams", requestedParams);
  try {
    const response = await GET("/check-username", {
      username: requestedParams,
    });
    return response;
  } catch (error) {
    throw error.response;
  }
};
