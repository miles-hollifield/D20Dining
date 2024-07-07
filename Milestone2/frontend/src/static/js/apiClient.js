import HTTPHelper from "./HTTPHelper.js";

const API_BASE = '/api';

// User authentication
const login = (username, password) => {
  const data = { username, password };
  return HTTPHelper.post(`${API_BASE}/users/login`, data);
};

const signup = (userData) => {
  return HTTPHelper.post(`${API_BASE}/users`, userData);
};

const getCurrentUser = () => {
  return HTTPHelper.get(`${API_BASE}/users/current`);
};

// Set interactions
function getSetsByUserId(userId) {
  return HTTPHelper.get(`${API_BASE}/users/${userId}/sets`);
}

// Favorite interactions
function getUserFavorites(userId) {
  return HTTPHelper.get(`${API_BASE}/users/${userId}/favorites`);
}

export default {
  login,
  signup,
  getCurrentUser,
  getSetsByUserId,
  getUserFavorites,
};
