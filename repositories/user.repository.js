const MongoStorage = require("../db/mongo.storage");

module.exports = new (class UsersRepository extends MongoStorage {
  constructor() {
    super("user");
  }

  find() {
    return this.Model.find();
  }

  retrieve(id) {
    return this.Model.retrieve(id);
  }

  retrieveByUuid(uuid) {
    return this.findByAttribute("uuid", uuid);
  }

  createUser(User) {
    const user = this.create(User);
    return user;
  }

  updateUser(id, variant) {
    return this.update(id, variant);
  }
})();
