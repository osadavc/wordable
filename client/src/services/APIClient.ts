import axios from "axios";
import NProgress from "nprogress";

const { NEXT_PUBLIC_API_URL } = process.env;

const isCSR = () => typeof window !== "undefined";

export const API = axios.create({
  baseURL: `${NEXT_PUBLIC_API_URL}.netlify/functions`,
  withCredentials: true,
});

API.interceptors.request.use(async (req) => {
  if (isCSR()) {
    NProgress.start();
  }
  return req;
});

API.interceptors.response.use(
  (res) => {
    if (isCSR()) {
      NProgress.done();
    }
    return res;
  },
  (err) => {
    if (isCSR()) {
      NProgress.done();
    }
    return Promise.reject(err);
  }
);
