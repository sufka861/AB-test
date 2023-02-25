const {Schema, model} = require("mongoose");

const goalSchema = new Schema(
        {
            name: {
                type: String,
                required: true
            },
            variantSuccessCount: {
                type: Object,
                properties: {
                    A: {type: Number, default: 0, min: 0,  required: true},
                    B: {type: Number, default: 0, min: 0,  required: true},
                    C: {type: Number, default: 0, min: 0,  required: true},
                    ON: {type: Number, default: 0, min: 0,  required: true},
                    OFF: {type: Number, default: 0, min: 0,  required: true},
                },
            }
        },
        {
            collection: "goals"
        }
    )
;

module.exports = model("Goal", goalSchema);
