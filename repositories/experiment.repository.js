const MongoStorage = require("../db/mongo.storage");
const validateDate = require("validate-date");
const {mongoose} = require("mongoose");
const moment = require('moment');

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

    async findByDate(year, month) {
        if (validateDate(`${month}/01/${year}`)) {
            const start = new Date(year, month - 1, 1);
            const end = new Date(year, month, 0);
            const result = await this.Model.find().countDocuments({
                 'duration.startTime': {
                    $gte: start,
                    $lte: end,
                },
            }).find();
            return result;
        }
    }

    async incCallCount(id) {
        return await this.update(id, {$inc: {callCount: 1, monthlyCallCount: 1}}).populate({path: 'goals'});
    }

    async incAttributeReqCount(id, attributes) {

        const filter = {_id: id, $or: Object.entries(attributes).reduce((acc, [key,val]) =>{

                if (['location', 'device', 'browser'].includes(key)) {

                    acc.push({[`testAttributes.${key}`]: { $elemMatch: { value: val } }})
                } else {
                    acc.push({[`customAttributes.${key}`]: { $elemMatch: { value: val } }})
                }
                return acc;
            },[{}])};


        const update = {
            $inc: Object.entries(attributes).reduce((acc, [key, value]) => {
                    if (['location', 'device', 'browser'].includes(key)) {
                        acc[`testAttributes.${key}.$[elem].valueReqCount`] = 1
                    } else {
                        acc[`customAttributes.${key}.$[elem].valueReqCount`] = 1
                    }
                    return acc;
                }
                , {})
        };
        const options = {
            arrayFilters: [{"elem.value": { $in: Object.entries(attributes).reduce((acc, [key, value]) => {
                        acc.push(value)
                        return acc;
                    }, []) } }]
        }


        return await this.updateMany(filter, update, options);

    }

    async getCallCount(id) {
        const experiment = await this.retrieve(id);

        if (experiment) return experiment.callCount;
        else return null;
    }

    async updateExperimentStatus(id, newStatus) {
        return await this.update(id, {status: newStatus}).populate({path: 'goals'});
    }

    async addGoal(experimentId, goalId) {
        return await this.update(experimentId, {$push: {goals: goalId}}).populate({path: 'goals'});
    }

    async removeGoal(experimentId, goalId) {
        return await this.update(experimentId, {$pull: {goals: goalId}}).populate({path: 'goals'});
    }

    async getMonthlyCalls(accountID) {
        return await this.Model.aggregate([
            {$match: {accountId: mongoose.Types.ObjectId(accountID)}},
            {$group: {_id: "$accountId", totalCalls: {$sum: "$monthlyCallCount"}}}
        ])
    }

  async resetMonthlyCallCount() {
    return await this.Model.updateMany({}, { $set: { monthlyCallCount: 0 } });
  }

  async getActiveExperimentsByDate(month, year){
    const start = moment.utc([year, month - 1, 1]).startOf('month');
    const end = moment.utc([year, month - 1, 1]).endOf('month');
    try {
        const result = await this.Model.countDocuments({
          status: 'active',
          'duration.startTime': { $lte: end.toDate() },
          $or: [
            { 'duration.endTime': { $gte: start.toDate() } },
            { 'duration.endTime': { $type: 'null' } },
          ],
        });
        return result;
    } catch {
    return null
    }
  }

  async getExperimentCountsByAttributes() {
    const result = await this.Model.aggregate([
      {
        $unwind: "$testAttributes.device"
      },
      {
        $group: {
          _id: {
            device: "$testAttributes.device"
          },
          count: { $sum: 1 }
        }
      },
      {
        $project: {
          _id: 0,
          device: "$_id.device",
          count: 1
        }
      },
      {
        $sort: {
          device: 1
        }
      }
    ]).exec();
    const locationResult = await this.Model.aggregate([
      {
        $unwind: "$testAttributes.location"
      },
      {
        $group: {
          _id: {
            location: "$testAttributes.location"
          },
          count: { $sum: 1 }
        }
      },
      {
        $project: {
          _id: 0,
          location: "$_id.location",
          count: 1
        }
      },
      {
        $sort: {
          location: 1
        }
      }
    ]).exec();
    return { devices: result, locations: locationResult };
  }
})();


