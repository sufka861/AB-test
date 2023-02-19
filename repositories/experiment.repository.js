const MongoStorage = require("../db/mongo.storage");
const validateDate = require("validate-date");

module.exports = new (class ExperimentsRepository extends MongoStorage {
  constructor() {
    super("experiment");
  }

  findByDate(year, month) {
    if (validateDate(`${month}/01/${year}`)) {
      const start = new Date(year, month, 1);
      const end = new Date(year, month, 31);
      return this.Model.countDocuments({
        end_time: {
          $gte: start,
          $lte: end,
        },
      });
    }
  }

  async incVariantSuccessCount(id, variant) {
    return await  this.update(id, {
      $inc: { [`variantSuccessCount.${variant}`]: 1 },
    });
  }

  async getVariantSuccessCount(id) {
    const experiment = await this.retrieve(id);
    if (experiment) return  experiment.variantSuccessCount;
    else return null;
  }

  async incCallCount(id) {
    return await this.update(id, { $inc: { callCount: 1 } });
  }

  async getCallCount(id) {
    const experiment = await this.retrieve(id);

    if (experiment) return experiment.callCount;
    else return null;
  }

  async updateExperimentStatus(id, newStatus) {
    return await this.update(id, { status: newStatus });
  }
})();
