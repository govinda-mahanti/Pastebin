import axios from "axios";

const BASE_URL = "http://localhost:5000/api";

export const createPaste = (data) =>
  axios.post(`${BASE_URL}/paste`, data);

export const getPaste = (id) =>
  axios.get(`${BASE_URL}/paste/${id}`);
