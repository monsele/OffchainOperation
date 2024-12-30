import axios from "axios";

export const offchainApi = axios.create({
  baseURL: "https://on-real.fly.dev/",
  headers: {
    "Content-Type": "application/json",
  },
});
