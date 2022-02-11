import axios from "axios";
import NProgress from "nprogress";

const { NEXT_PUBLIC_API_URL } = process.env;

export const API = axios.create({
  baseURL: `${NEXT_PUBLIC_API_URL}.netlify/functions`,
  withCredentials: true,
});

API.interceptors.request.use(async (req) => {
  NProgress.start();
  return req;
});

API.interceptors.response.use(
  (res) => {
    NProgress.done();
    return res;
  },
  (err) => {
    NProgress.done();
    return Promise.reject(err);
  }
);
