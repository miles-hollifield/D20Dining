// Importing the Set model
const Set = require('./models/set');
const db = require('./dbConnection');

const SetDAO = {
    // Retrieve all sets created by a specific user using MySQL
    getSetsByUserId(userId) {
        const query = 'SELECT * FROM sets WHERE user_id = ?';
        return db.query(query, [userId])
            .then(results => {
                return results.map(result => new Set(result));
            })
            .catch(error => {
                console.error("Error fetching sets by user ID:", error);
                throw error;
            });
    },


    // Fetch details of a specific set by set ID
    getSetById(setId) {
        const query = 'SELECT * FROM sets WHERE set_id = ?';
        return db.query(query, [setId]).then(({ results }) => {
            if (results.length > 0) {
                return new Set(results[0]);
            } else {
                throw new Error('Set not found');
            }
        });
    },

    // Create a new set for a user
    createSet(userId, setName) {
        const query = 'INSERT INTO sets (user_id, set_name) VALUES (?, ?)';
        return db.query(query, [userId, setName]).then(({ insertId }) => {
            return new Set({
                set_id: insertId,
                user_id: userId,
                set_name: setName
            });
        });
    },

    // Update the name or other details of a set
    updateSet(setId, setName) {
        const query = 'UPDATE sets SET set_name = ? WHERE set_id = ?';
        return db.query(query, [setName, setId]).then(({ affectedRows }) => {
            if (affectedRows > 0) {
                return new Set({
                    set_id: setId,
                    set_name: setName
                    // If more fields are updated, include them here.
                });
            } else {
                throw new Error('Set not found or no changes made');
            }
        });
    },

    // Delete a set
    deleteSet(setId) {
        const query = 'DELETE FROM sets WHERE set_id = ?';
        return db.query(query, [setId]).then(({ affectedRows }) => {
            if (affectedRows === 0) {
                throw new Error('Set not found');
            }
            // No need to return anything on successful deletion.
        });
    }
};

module.exports = SetDAO;
