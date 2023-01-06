const MongoStorage = require("../db/MongoStorage");

module.exports = class UsersRepository {
  constructor() {
    this.storage = new MongoStorage("user");
  }

  find() {
    return this.storage.find();
  }

  retrieve(id) {
    return this.storage.retrieve(id);
  }

  retrieveByUuid(uuid) {
    return this.storage.retrieveByAttribute("uuid", uuid);
  }

  create(User) {
    const user = this.storage.create(User);
    return user;
  }

  update(id, variant) {
    return this.storage.update(id, variant);
  }
};
