const MongoStorage = require("../db/MongoStorage");

module.exports = class UsersRepository {
    constructor() {
        this.storage = new MongoStorage("experiment");
    }

    find() {
        return this.storage.find();
    }

    retrieve(id) {
        return this.storage.retrieve(id);
    }

    create(experiment) {
        const user = this.storage.create(experiment);
        return user;
    }

    update(id, experiment) {
        return this.storage.update(id, experiment);
    }

    delete(id) {
        return this.storage.delete(id);
    }

    findByTwoAttributes(key, value, key2, value2) {
        return this.storage.findByTwoAttributes(key, value, key2, value2);
    }

    findByAttribute(key, value) {
        return this.storage.findByAttribute(key, value);
    }

    findByDate(year, month) {
        return this.storage.findByDate(year, month);
    }
}