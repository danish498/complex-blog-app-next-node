const { default: axios } = require("axios");

import { POST } from "../../../services/APIconfig";

export const existedUser = async (requestedParams) => {
  try {
    const response = await POST("/login", requestedParams);
    return response;
  } catch (error) {
    throw error;
  }
};
