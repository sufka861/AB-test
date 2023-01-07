const {MongoStorage} = require ('./mongo.storage');

module.exports =  new class ExperimentStorage extends  MongoStorage{
    constructor() {
        super("experiment");
    }

    incVariantSuccessCount(id, variant){
        return this.update(id, {$inc : {[`variant_success_count.${variant}`]: 1}});
    }

    getVariantSuccessCount(id){
        const experiment = this.retrieve(id);
        if(!! experiment)
            return experiment.variant_success_count;
        else
            return null;
    }
    incCallCount(id){
        return this.update(id, {$inc : {"call_count": 1}});

    }

    getCallCount(id){
        const experiment = this.retrieve(id);
        if(!! experiment)
            return experiment.call_count;
        else
            return null;
    }

    updateExperimentStatus(id, newStatus){
        return this.update(id, {status : newStatus});
    }

}
