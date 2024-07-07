const db = require('./dbConnection');
const Favorite = require('./models/favorite');

const FavoritesDAO = {
    // Retrieve all favorite restaurants for a specific user
    async getUserFavorites(userId) {
        const query = `
            SELECT f.favorite_id, f.user_id, f.restaurant_id, r.name as restaurant_name, r.cuisine
            FROM favorites f
            JOIN restaurants r ON f.restaurant_id = r.restaurant_id
            WHERE f.user_id = ?`;
        try {
            const { results } = await db.query(query, [userId]);
            return results.map(result => new Favorite({
                favorite_id: result.favorite_id,
                user_id: result.user_id,
                restaurant_id: result.restaurant_id,
                name: result.restaurant_name,
                cuisine: result.cuisine
            }));
        } catch (error) {
            console.error("Error fetching user favorites:", error);
            throw error;
        }
    },

    // Add a restaurant to a user's favorites
    async addFavorite(userId, restaurantId) {
        const query = 'INSERT INTO favorites (user_id, restaurant_id) VALUES (?, ?)';
        try {
            const { insertId } = await db.query(query, [userId, restaurantId]);
            return new Favorite({
                favorite_id: insertId,
                user_id: userId,
                restaurant_id: restaurantId
            });
        } catch (error) {
            console.error("Error adding favorite:", error);
            throw error;
        }
    },

    // Remove a restaurant from a user's favorites
    async removeFavorite(favoriteId) {
        const query = 'DELETE FROM favorites WHERE favorite_id = ?';
        try {
            const { affectedRows } = await db.query(query, [favoriteId]);
            if (affectedRows === 0) {
                throw new Error('Favorite not found');
            }
            // No need to return anything on successful deletion.
        } catch (error) {
            console.error("Error removing favorite:", error);
            throw error;
        }
    }
};

module.exports = FavoritesDAO;
