const db = require('./dbConnection');
const User = require('./models/user');

function getUsers() {
    const query = 'SELECT * FROM users';
    return db.query(query, []).then(results => {
        return results.map(user => new User(user));
    }).catch(error => {
        console.error("Error fetching users:", error);
        throw error;
    });
}

function getUser(userId) {
    const query = 'SELECT * FROM users WHERE user_id=?';
    return db.query(query, [userId]).then(results => {
        if (results.length > 0) {
            return new User(results[0]);
        } else {
            throw new Error('User not found');
        }
    }).catch(error => {
        console.error("Error fetching user by ID:", error);
        throw error;
    });
}

async function getUserByCredentials(username, password) {
    try {
        const query = 'SELECT * FROM users WHERE username=?';
        const results = await db.query(query, [username]);
        if (results.length > 0) {
            const user = new User(results[0]);
            const isValid = await user.validatePassword(password);
            if (isValid) {
                return user;
            } else {
                throw new Error("Invalid username or password");
            }
        } else {
            throw new Error("User not found");
        }
    } catch (error) {
        console.error("Error in getUserByCredentials:", error);
        throw error;
    }
}

function getUserByUsername(username) {
    const query = 'SELECT * FROM users WHERE username=?';
    return db.query(query, [username]).then(results => {
        if (results.length > 0) {
            return new User(results[0]);
        } else {
            throw new Error("Can't find user " + username);
        }
    }).catch(error => {
        console.error("Error fetching user by username:", error);
        throw error;
    });
}

function getUserFavorite(userId) {
    return new Promise((resolve, reject) => {
        let userfavorites = sets[userId] ? sets[userId].favorites : null;
        if(userfavorites) {
            resolve(userfavorites);
        } else {
            reject("Favorites not found");
        }
    });
}

function createUser(userInfo) {
    return new Promise((resolve, reject) => {
        getUserByUsername(userInfo.username)
            .then(() => reject("Username already taken"))
            .catch(() => {
                let newUser = {...userInfo, userId: Object.keys(users).length + 1, followers: [], following: [], profilePicture: null};
                users[newUser.userId] = newUser;
                resolve(newUser);
            });
    });
}

function createUser(userInfo) {
    const query = 'INSERT INTO users (firstname, lastname, username, email, avatar, salt, password) VALUES (?, ?, ?, ?, ?, ?, ?)';
    return db.query(query, [
        userInfo.firstname,
        userInfo.lastname,
        userInfo.username,
        userInfo.email,
        userInfo.avatar,
        userInfo.salt,
        userInfo.password
    ]).then(({insertId}) => {
        return new User({...userInfo, user_id: insertId});
    }).catch(error => {
        console.error("Error creating user:", error);
        throw error;
    });
}

module.exports = {
    getUsers,
    getUser,
    getUserByCredentials,
    getUserByUsername,
    createUser,
    getUserFavorite
};
