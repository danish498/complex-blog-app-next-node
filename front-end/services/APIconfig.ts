import axios from "axios";
interface fetchWrapProps {
  method: "get" | "post" | "put" | "delete";
  url: string;
  body?: string;
  signal?: AbortSignal;
}

const fetchWrapper = async ({ method, url, body, signal }: fetchWrapProps) => {
  const token = localStorage.getItem("token");
  const config = {
    baseURL: "http://192.168.29.18:8080/api/v1",
    headers: {
      Authorization: !!token ? `Token ${token}` : "",
    },
    signal: signal,
  };

  try {
    let response;
    if (method === "get") {
      const params = new URLSearchParams(body).toString();
      response = await axios.get(`${url}?${params}`, config);
    } else if (method === "post") {
      response = await axios.post(url, body, config);
    }
    return response?.data;
  } catch (error) {
    throw error;
  }
};

export const GET = (url: string, body: string, signal?: AbortSignal) =>
  fetchWrapper({ method: "get", url, body, signal });

export const POST = (url: string, body: string, signal?: AbortSignal) =>
  fetchWrapper({ method: "post", url, body, signal });
