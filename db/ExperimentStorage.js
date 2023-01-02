const {MongoStorage} = require ('./MongoStorage');

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
    getCallCount(id){
        const experiment = this.retrieve(id);
        if(!! experiment)
            return experiment.call_count;
        else
            return null;
    }

}
