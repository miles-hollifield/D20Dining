module.exports = class SetEntry {
    setEntryId = null;
    setId = null;
    restaurantId = null;

    constructor(data) {
        this.setEntryId = data.set_entry_id;
        this.setId = data.set_id;
        this.restaurantId = data.restaurant_id;
    }
};
