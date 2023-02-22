const MongoStorage = require("../db/mongo.storage");
const validateDate = require("validate-date");

module.exports = new (class ExperimentsRepository extends MongoStorage {
  constructor() {
    super("experiment");
  }

  find() {
    return this.Model.find({}).populate({path: 'goals'});
  }

  findByTwoAttributes(key, value, key2, value2) {
    const obj = {};
    obj[key] = value;
    if (key2 && value2) {
      obj[key2] = value2;
    }
    return this.Model.find(obj).populate({path: 'goals'});
  }

  findByAttribute(key, value) {
    const obj = {};
    obj[key] = value;
    return this.Model.find(obj).populate({path: 'goals'});
  }

  retrieve(id) {
    return this.Model.findById(id).populate({path: 'goals'});
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
      }).populate({path: 'goals'});
    }
  }


  async incCallCount(id) {
    return await this.update(id, { $inc: { call_count: 1 } }).populate({path: 'goals'});
  }

  async incReqCount(id, req) {
    return await this.update(id, { $inc: { test_attributes: 1 } });
  }

  async getCallCount(id) {
    const experiment = await this.retrieve(id);

    if (experiment) return experiment.call_count;
    else return null;
  }

  async updateExperimentStatus(id, newStatus) {
    return await this.update(id, { status: newStatus }).populate({path: 'goals'});
  }

  async addGoal(experimentId, goalId){
    return await this.update(experimentId, {$push: {goals: goalId}}).populate({path: 'goals'});
  }
  async removeGoal(experimentId, goalId){
    return await this.update(experimentId, {$pull: {goals: goalId}}).populate({path: 'goals'});
  }

})();
