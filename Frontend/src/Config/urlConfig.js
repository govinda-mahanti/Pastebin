import axios from "axios";

const BASE_URL = "https://pastebin-backend-thk0.onrender.com/api";

export const createPaste = (data) =>
  axios.post(`${BASE_URL}/paste`, data);

export const getPaste = (id) =>
  axios.get(`${BASE_URL}/paste/${id}`);
