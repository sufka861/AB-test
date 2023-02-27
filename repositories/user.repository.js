const MongoStorage = require("../db/mongo.storage");

module.exports = new (class UsersRepository extends MongoStorage {
  constructor() {
    super("user");
  }

  retrieveByUuid(uuid) {
    return this.findByAttribute("uuid", uuid);
  }

  async getExperimentStats(experimentId) {
    const users = await this.Model.find({ "experiments.experimentId": experimentId }).lean();
    const stats = {
      totalUsers: users.length,
      variantCounts: {
        A: 0,
        B: 0,
        C: 0,
        ON: 0,
        OFF: 0
      }
    };
    users.forEach(user => {
      const experiment = user.experiments.find(e => e.experimentId.toString() === experimentId.toString());
      if (experiment && experiment.variant) {
        stats.variantCounts[Object.keys(experiment.variant)[0]] += 1;
      }
    });
    return stats;
  }

  createUser(User) {
    const user = this.create(User);
    return user;
  }

  updateUser(id, variant) {
    return this.update(id, variant);
  }

})();
