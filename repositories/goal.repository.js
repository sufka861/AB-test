const MongoStorage = require("../db/mongo.storage");

module.exports = new (class GoalRepository extends MongoStorage {
    constructor() {
        super("goal");
    }

    getGoalSuccessCountById(goalId) {
        return this.retrieve(goalId)?.successCount ?? null;
    }

    incGoalSuccessCount(goalId) {
        return this.update(goalId, {$inc: {success_count: 1}})
    }

    async incVariantSuccessCount(id, variant) {
        return await this.update(id, {
            $inc: {[`variantSuccessCount.${variant}`]: 1},
        });
    }
    async getVariantSuccessCount(id) {
        const experiment = await this.retrieve(id);
        if (experiment) return  experiment.variantSuccessCount;
        else return null;
    }
})();
