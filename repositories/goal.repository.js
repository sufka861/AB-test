const MongoStorage = require("../db/mongo.storage");

module.exports = new (class GoalRepository extends MongoStorage {
    constructor() {
        super("goal");
    }

    getGoalSuccessCountById(goalId) {
        return this.retrieve(goalId)?.successCount ?? null;
    }
    incGoalSuccessCount(goalId){
        return this.update(goalId, {$inc : {successCount: 1}})
    }
})();
