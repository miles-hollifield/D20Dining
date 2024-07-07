import HTTPHelper from "./HTTPHelper.js";

const API_BASE = '/api';

// User authentication
const login = (username, password) => {
  const data = { username, password };
  return HTTPHelper.post(`${API_BASE}/users/login`, data);
};

// Function to sign up
const signup = (userData) => {
  return HTTPHelper.post(`${API_BASE}/users`, userData);
};

// Function to log out
const logout = () => {
    return HTTPHelper.get(`${API_BASE}/users/logout`);
}

// Function to get current user
const getCurrentUser = () => {
  return HTTPHelper.get(`${API_BASE}/users/current`);
};

// Function to get current user
const getUserById = (id) => {
  return HTTPHelper.get(`${API_BASE}/users/id/${id}`);
};

// Function to get profile pic
const getProfilePic = (userId) => {
    return HTTPHelper.get(`${API_BASE}/users/${userId}/profile-picture`);
};

// Set interactions
function getSetsByUserId(userId) {
  return HTTPHelper.get(`${API_BASE}/users/${userId}/sets`);
}

// Favorite interactions
function getUserFavorites(userId) {
  return HTTPHelper.get(`${API_BASE}/users/${userId}/favorites`);
}

// Profile interactions
function updateCurrentUser(userData) {
  console.log("Sending update:", userData);
  return HTTPHelper.put(`${API_BASE}/users/current`, userData);
}

// Function to get restaurants in a set
function getRestaurantsInSet(setId) {
  return HTTPHelper.get(`${API_BASE}/sets/${setId}/restaurants`);
}

// Function to add a restaurant to a set
function searchRestaurantByLocationAndName(lat, lon, name) {
  let latURL = encodeURIComponent(lat);
  let lonURL = encodeURIComponent(lon);
  let nameURL = encodeURIComponent(name);
  return HTTPHelper.get(`${API_BASE}/restaurants/search/${latURL}/${lonURL}/${nameURL}`);
}

// Function to search a restaurant by name
function searchRestaurantByName(name) {
  let nameURL = encodeURIComponent(name);
  return HTTPHelper.get(`${API_BASE}/restaurants/search/${nameURL}`);
}

// Function to add a restaurant to a set
function addRestaurantToSet(setId, restaurantId) {
  return HTTPHelper.post(`${API_BASE}/sets/addRestaurant`, { setId, restaurantId });
}


// Function to add a restaurant to a set
function updateUserPFP(user, newAvatar) {
    let newUser = user;
    newUser.avatar = newAvatar;
    console.log("USER UPDATED", newUser);
  return HTTPHelper.put(`${API_BASE}/users/current`, newUser );
}

// Function to remove a favorite
function deleteFavorite(favoriteId) {
  return HTTPHelper.del(`${API_BASE}/favorites/${favoriteId}`);
}

// Function to add a new set
function addSet(setName, userId) {
  const data = { setName, userId }; 
  return HTTPHelper.post(`${API_BASE}/sets`, data);``
}

// Function to delete a restaurant from a set
function deleteRestaurantFromSet(setEntryId) {
  return HTTPHelper.del(`${API_BASE}/sets/restaurant/${setEntryId}`);
}

// Function to delete an entire set
function deleteSet(setId) {
  return HTTPHelper.del(`${API_BASE}/sets/${setId}`);
}

// Function to delete all favorites
function deleteAllFavorites(userId) {
  return HTTPHelper.del(`${API_BASE}/users/${userId}/favorites`);
}

// Function to delete all sets
function deleteAllSets(userId) {
  return HTTPHelper.del(`${API_BASE}/users/${userId}/sets/all`);
}

// Function to add restaurant to favorites through search
function addRestaurantToFavorites(name, cuisine, website) {
  return HTTPHelper.post(`${API_BASE}/favorites/add`, { name, cuisine, website });
}


export default {
  login,
  signup,
  logout,
  getProfilePic,
  getCurrentUser,
  getSetsByUserId,
  updateUserPFP,
  getUserFavorites,
  updateCurrentUser,
  getRestaurantsInSet,
  searchRestaurantByLocationAndName,
  searchRestaurantByName,
  addRestaurantToSet,
  deleteFavorite,
  addSet,
  deleteRestaurantFromSet,
  deleteSet,
  getUserById,
  deleteAllFavorites,
  deleteAllSets,
  addRestaurantToFavorites
};