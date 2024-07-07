import api from './apiClient.js';

const searchBar = document.querySelector('#restaurantSearch');
const searchResults = document.querySelector('.search-list');
const spinner = document.querySelector('#spinner');

searchBar.addEventListener('change', () => {
    searchResults.innerHTML = '';
    spinner.style.display = 'flex';
    if (searchBar.value.length > 2) {
        getRestaurantInformation().then(results => {
            spinner.style.display = 'none';
            if (results.length === 0) {
                searchResults.innerHTML = "No Restaurants found, please try another search.";
            } else {
                results.forEach(result => {
                    let li = createRestaurantElement(result.image, result.name, result.categories);
                    searchResults.appendChild(li);
                });
            }
        }).catch(error => {
            console.error("Error fetching search results:", error);
            spinner.style.display = 'none';
        });
    }
});

async function getRestaurantInformation() {
    try {
        if (navigator.geolocation) {
            const position = await new Promise((resolve, reject) => {
                navigator.geolocation.getCurrentPosition(resolve, reject, {
                    enableHighAccuracy: true,
                    timeout: 5000,
                    maximumAge: 0
                });
            });
            return await api.searchRestaurantByLocationAndName(position.coords.latitude, position.coords.longitude, searchBar.value);
        } else {
            return await api.searchRestaurantByName(searchBar.value);
        }
    } catch (error) {
        console.error("An error occurred:", error);
        return await api.searchRestaurantByName(searchBar.value);
    }
}

function createRestaurantElement(logoSrc, name, categories, isFavorite) {
    let li = document.createElement("li");
    li.classList.add("search-item");

    let img = document.createElement("img");
    img.src = logoSrc;
    img.alt = name + " Logo";
    img.classList.add("restaurant-logo");

    let div = document.createElement("div");
    div.classList.add("restaurant-info");

    let h2 = document.createElement("h2");
    h2.textContent = name;

    let p = document.createElement("p");
    p.textContent = categories.join(', ');

    let button = document.createElement("button");
    button.classList.add("add-btn");
    if (isFavorite) {
        button.textContent = "♥"; // Heart icon if already a favorite
        button.disabled = true; // Disable if already a favorite
    } else {
        button.textContent = "+"; // Plus icon if not a favorite
        button.onclick = () => addToFavorites(name, categories.join(', '), logoSrc, button);
    }

    div.appendChild(h2);
    div.appendChild(p);

    li.appendChild(img);
    li.appendChild(div);
    li.appendChild(button);

    return li;
}

async function addToFavorites(name, cuisine, logoSrc) {
    try {
        // Attempt to add the restaurant to favorites
        const response = await api.addRestaurantToFavorites(name, cuisine, logoSrc);
        
        if (response.exists) {
            alert("This restaurant is already in your favorites.");
        } else if (response.success) {
            alert("Added to favorites!");
            // Update the button to reflect that it's already a favorite
            updateButtonToFavorite(name);
        } else {
            alert("Failed to add to favorites.");
        }
    } catch (error) {
        console.error("Failed to add to favorites:", error);
        alert("Failed to add to favorites.");
    }
}

function updateButtonToFavorite(restaurantName) {
    // Find the button corresponding to the restaurant and update its class and text
    const buttons = document.querySelectorAll('.add-btn');
    buttons.forEach(button => {
        let parent = button.parentNode;
        if (parent.querySelector('h2').textContent === restaurantName) {
            button.textContent = "♥";
            button.classList.add('favorite');
            button.onclick = null;
        }
    });
}
