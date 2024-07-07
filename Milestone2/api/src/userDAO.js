const apiRouter = require('express').Router();

const users = require('./data/sampleUser');
const sets = require('./data/sampleSets');

// Define functions
function getUsers() {
    return new Promise((resolve, reject) => {
        resolve(Object.values(users));
    });
}

function getUser(userId) {
    return new Promise((resolve, reject) => {
        const user = users[userId];
        if(user) {
            resolve(user);
        } else {
            reject("User not found");
        }
    });
}

function getUserByUsername(username) {
    return new Promise((resolve, reject) => {
        const user = Object.values(users).find(user => user.username === username);
        if(user) {
            resolve(user);
        } else {
            reject("Can't find user " + username);
        }
    });
}

function getUserSets(userId) {
    return new Promise((resolve, reject) => {
        const userSets = sets[userId] ? sets[userId].sets : null;
        if(userSets) {
            resolve(Object.values(userSets));
        } else {
            reject("Sets not found");
        }
    });
}

function getUserSet(userId, setName) {
    return new Promise((resolve, reject) => {
        let userSets = sets[userId] ? sets[userId].sets : null;
        let userSet = userSets ? userSets.filter(set => set.setName === setName) : null;
        if(userSet && userSet.length > 0) {
            resolve(userSet[0]);
        } else {
            reject("Set not found");
        }
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


function getFollowingIds(userId) {
    return new Promise((resolve, reject) => {
        getUser(userId)
            .then(user => resolve(user.following))
            .catch(reject);
    });
}

function getFollowersIds(userId) {
    return new Promise((resolve, reject) => {
        getUser(userId)
            .then(user => resolve(user.followers))
            .catch(reject);
    });
}



function createUserSet(userId, setName) {
    return new Promise((resolve, reject) => {
        getUser(userId).then( user => {
            getUserSet(setName).then( set => {
                reject("set exists already");
            }).catch( error => {
                let userSets = sets[user[userId]];
                let newSet = {};
                newSet.setName = setName;
                newSet.restaraunts = [];

                userSets.push(newSet);
                
                resolve(newSet);
            })
        })
        .catch( error => {
            console.log(error);
            reject(error);
        })
    }) 
}


// Export functions
module.exports = {
    getUsers,
    getUser,
    getUserByUsername,
    getUserSets,
    getUserSet,
    getUserFavorite,
    createUser,
    createUserSet,
    getFollowingIds,
    getFollowersIds
};
