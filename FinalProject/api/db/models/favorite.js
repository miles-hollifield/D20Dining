module.exports = class Favorite {
    favoriteId = null;
    userId = null;
    restaurantId = null;
    restaurantName = null;
    cuisine = null;

    constructor(data) {
        this.favoriteId = data.favoriteId;
        this.userId = data.userId;
        this.restaurantId = data.restaurantId;
        this.restaurantName = data.restaurantName;
        this.cuisine = data.cuisine;
    }
};
