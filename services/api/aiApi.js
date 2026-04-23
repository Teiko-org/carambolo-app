import axios from "axios";

const aiApi = axios.create({
  baseURL: "http://localhost:8000",
  timeout: 60000,
  headers: {
    "Content-Type": "application/json",
  },
});

export default aiApi;
