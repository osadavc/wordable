import axios from "axios";

export const twitterClient = axios.create({
  baseURL: "https://api.twitter.com/2",
});
