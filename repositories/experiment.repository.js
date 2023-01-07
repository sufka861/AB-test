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

  incVariantSuccessCount(id, variant) {
    return this.update(id, {
      $inc: { [`variant_success_count.${variant}`]: 1 },
    });
  }

  getVariantSuccessCount(id) {
    const experiment = this.retrieve(id);
    if (!!experiment) return experiment.variant_success_count;
    else return null;
  }

  incCallCount(id) {
    return this.update(id, { $inc: { call_count: 1 } });
  }

  getCallCount(id) {
    const experiment = this.retrieve(id);
    if (!!experiment) return experiment.call_count;
    else return null;
  }

  updateExperimentStatus(id, newStatus) {
    return this.update(id, { status: newStatus });
  }
})();
