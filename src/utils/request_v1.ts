import axios from "axios";
import axiosRetry from "axios-retry";

const requestInstance = axios.create({ baseURL: "http://localhost:3332" });
axiosRetry(requestInstance, {
  retries: 3,
});

requestInstance.interceptors.response.use(
  (response) => {
    console.log(response);
    return Promise.resolve(response);
  },
  (err) => {
    console.log(err);
    return Promise.reject(err);
  },
);

export default requestInstance;
