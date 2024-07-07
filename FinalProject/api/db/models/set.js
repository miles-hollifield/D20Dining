module.exports = class Set {
    setId = null;
    userId = null;
    setName = null;

    constructor(data) {
        this.setId = data.set_id;
        this.userId = data.user_id;
        this.setName = data.set_name;
  }
};
