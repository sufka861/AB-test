const {Schema, model, ObjectId} = require('mongoose');

const goalSchema = new Schema({
    att_success_count: {
        ON: {type: Number, default: 0, min: 0, required: true},
        OFF: {type: Number, default: 0, min: 0, required: true},
    },
    experiment_id: {type: ObjectId, required: true}
}, {collection: "goals"});

module.exports = model("Goals", goalSchema);


