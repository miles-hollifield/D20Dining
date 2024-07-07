// Importing the Restaurant model
const Restaurant = require('./models/restaurant');
const db = require('./dbConnection');

const RestaurantDAO = {
    // Retrieve a list of all restaurants
    getRestaurants() {
        const query = 'SELECT * FROM restaurants';
        return db.query(query).then(({ results }) => {
            return results.map(result => new Restaurant(result));
        });
    },

    // Fetch a single restaurant by its ID
    getRestaurantById(restaurantId) {
        const query = 'SELECT * FROM restaurants WHERE restaurant_id = ?';
        return db.query(query, [restaurantId]).then(({ results }) => {
            if (results.length > 0) {
                return new Restaurant(results[0]);
            } else {
                throw new Error('Restaurant not found');
            }
        });
    },

    // Add a new restaurant to the database
    createRestaurant(restaurantInfo) {
        const query = 'INSERT INTO restaurants (restaurant_name, restaurant_cuisine, restaurant_website) VALUES (?, ?, ?)';
        return db.query(query, [restaurantInfo.restaurant_name, restaurantInfo.restaurant_cuisine, restaurantInfo.restaurant_website])
            .then(({ insertId }) => {
                return new Restaurant({
                    restaurant_id: insertId,
                    ...restaurantInfo
                });
            });
    },

    // Update details of an existing restaurant
    updateRestaurant(restaurantId, restaurantInfo) {
        const query = 'UPDATE restaurants SET restaurant_name = ?, restaurant_cuisine = ?, restaurant_website = ? WHERE restaurant_id = ?';
        return db.query(query, [restaurantInfo.restaurant_name, restaurantInfo.restaurant_cuisine, restaurantInfo.restaurant_website, restaurantId])
            .then(({ affectedRows }) => {
                if (affectedRows > 0) {
                    return new Restaurant({
                        restaurant_id: restaurantId,
                        ...restaurantInfo
                    });
                } else {
                    throw new Error('Restaurant not found or no changes made');
                }
            });
    },

    // Remove a restaurant from the database
    deleteRestaurant(restaurantId) {
        const query = 'DELETE FROM restaurants WHERE restaurant_id = ?';
        return db.query(query, [restaurantId]).then(({ affectedRows }) => {
            if (affectedRows === 0) {
                throw new Error('Restaurant not found');
            }
            // No need to return anything on successful deletion.
        });
    }
};

module.exports = RestaurantDAO;
