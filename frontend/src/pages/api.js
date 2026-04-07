// pages/api.js
export const API_BASE_URL =
  process.env.NODE_ENV === "development"
    ? "http://localhost:5000"
    : "https://apricot-tart-74890-3cafeb8efb3e.herokuapp.com";