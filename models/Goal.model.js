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
                    A: {type: Number, min: 0,},
                    B: {type: Number, min: 0,},
                    C: {type: Number, min: 0,},
                    ON: {type: Number, min: 0,},
                    OFF: {type: Number, min: 0,},
                },
                default: {
                    A: 0,
                    B: 0,
                    C: 0,
                    ON: 0,
                    OFF: 0,
                }
            }
        },
        {
            collection: "goals"
        }
    )
;

module.exports = model("Goal", goalSchema);
