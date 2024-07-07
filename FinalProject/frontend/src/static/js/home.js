import api from "./apiClient.js";

const rollButton = document.querySelector('.roll-btn');
const rollNumber = document.querySelector('#roll-number');
const setsDropdown = document.querySelector('.custom-select');
// Elements for displaying restaurant information
const restaurantInfoDisplay = document.querySelector('#restaurant-display');
const restaurantNameDisplay = document.querySelector('#restaurant-name');
const restaurantWebsiteDisplay = document.querySelector('#restaurant-website');
let restaurants = []; // Array to hold restaurants of the currently selected set

// The button to clear data
const clearDataButton = document.getElementById('clear-data');

let currentUser = null;

clearDataButton.addEventListener('click', () => {
    // Confirmation dialog
    const userConfirmed = confirm('Are you sure you want to delete all your saved favorites and sets? This action cannot be undone.');

    // If confirmed, call the API endpoints
    if (userConfirmed) {
        // Delete all favorites
        api.deleteAllFavorites(currentUser.id)
            .then(() => {
                console.log('Favorites cleared');
                // Now delete all sets
                return api.deleteAllSets(currentUser.id);
            })
            .then(() => {
                console.log('Sets cleared');
                alert('All your saved favorites and sets have been deleted.');
            })
            .catch(error => {
                console.error('Error clearing data:', error);
                alert('There was an error clearing your data.');
            });
    }
});

// Event listener for rolling the dice
rollButton.addEventListener('click', () => {
    if (restaurants.length === 0) {
        alert("Please select a set first.");
        return;
    }

    const index = Math.floor(Math.random() * restaurants.length); // Get a random index based on the length of the restaurants array
    const selectedRestaurant = restaurants[index]; // Get the restaurant at the random index
    rollNumber.innerHTML = index + 1; // Display the number (index + 1 since array is 0 indexed)
    
    // Call function to update the UI with the selected restaurant
    updateRestaurantDisplay(selectedRestaurant);
});

// Function to update the restaurant display section
function updateRestaurantDisplay(restaurant) {
    restaurantNameDisplay.textContent = restaurant.restaurantName;
    restaurantWebsiteDisplay.href = restaurant.website;
    restaurantWebsiteDisplay.textContent = 'Visit Website';

    // Show the restaurant info section if it was hidden
    restaurantInfoDisplay.style.display = 'block';
}

// Event listener for when a set is selected from the dropdown
setsDropdown.addEventListener('change', (e) => {
    const setId = e.target.value;
    if (setId) {
        api.getRestaurantsInSet(setId).then(response => {
            restaurants = response; // Store the restaurants of the selected set
            console.log(`Loaded ${restaurants.length} restaurants from set ID ${setId}`);
        }).catch(error => console.error("Failed to fetch restaurants in set:", error));
    }
});

document.addEventListener("DOMContentLoaded", function() {
    api.getCurrentUser().then(user => {
        if (user && user.id) {
            currentUser = user;
            api.getSetsByUserId(user.id).then(response => { 
                populateSetsDropdown(response);
            }).catch(error => console.error("Failed to fetch user's sets:", error));
        }
    }).catch(error => console.error("Failed to fetch current user:", error));
});

// Function to populate the sets dropdown
function populateSetsDropdown(sets) {
    sets.forEach(set => {
        let option = document.createElement('option');
        option.value = set.setId;
        option.textContent = set.setName;
        setsDropdown.appendChild(option);
    });
}
