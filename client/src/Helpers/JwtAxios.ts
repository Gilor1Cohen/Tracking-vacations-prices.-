import axios from "axios";

const jwtAxios = axios.create();

jwtAxios.interceptors.request.use((request) => {
  const token = localStorage.getItem("Token");

  if (token) {
    request.headers = {
      ...request.headers,
      authorization: "Bearer " + token,
    } as any;
  }

  return request;
});

export default jwtAxios;
