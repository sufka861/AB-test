const MongoStorage = require("../db/mongo.storage");

module.exports = new (class GoalRepository extends MongoStorage {
    constructor() {
        super("goal");
    }

    getGoalSuccessCountById(goalId) {
        return this.retrieve(goalId)?.success_count ?? null;
    }
})();
