const MongoStorage = require("../db/mongo.storage");

module.exports = new (class UsersRepository extends MongoStorage {
  constructor() {
    super("user");
  }
  retrieveByUuid(uuid) {
    return this.findByAttribute("uuid", uuid);
  }

  numUsersByExperimentIdAndVariant (id, variant){
    return this.Model.count({experiments : { $elemMatch : {experimentId: id , variant: variant}}});
  }

  numUsersByExperimentId (id){
    return this.Model.count({experiments : { $elemMatch : {experimentId: id }}})
  }

  createUser(User) {
    const user = this.create(User);
    return user;
  }

  updateUser(id, variant) {
    return this.update(id, variant);
  }
})();
