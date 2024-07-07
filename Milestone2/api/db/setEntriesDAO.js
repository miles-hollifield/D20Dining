const db = require('./dbConnection');
const SetEntry = require('./models/set_entry');

const SetEntriesDAO = {
    // Get all restaurants in a specific set
    getRestaurantsInSet(setId) {
        const query = `
            SELECT r.*, se.set_entry_id FROM restaurants r
            INNER JOIN set_entries se ON r.restaurant_id = se.restaurant_id
            WHERE se.set_id = ?`;
        return db.query(query, [setId]).then(({ results }) => {
            return results.map(result => new SetEntry(result));
        });
    },

    // Add a restaurant to a set
    addRestaurantToSet(setId, restaurantId) {
        const query = 'INSERT INTO set_entries (set_id, restaurant_id) VALUES (?, ?)';
        return db.query(query, [setId, restaurantId]).then(({ insertId }) => {
            return new SetEntry({
                set_entry_id: insertId,
                set_id: setId,
                restaurant_id: restaurantId
            });
        });
    },

    // Remove a restaurant from a set
    removeRestaurantFromSet(setId, restaurantId) {
        const query = 'DELETE FROM set_entries WHERE set_id = ? AND restaurant_id = ?';
        return db.query(query, [setId, restaurantId]).then(({ affectedRows }) => {
            if (affectedRows === 0) {
                throw new Error('Set entry not found or no changes made');
            }
            // No need to return anything on successful deletion.
        });
    }
};

module.exports = SetEntriesDAO;
