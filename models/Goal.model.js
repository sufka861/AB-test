
const { Schema, model } = require("mongoose");

const userSchema = new Schema(
    {
        name:{
            type: String,
            required: true
        },
        key : {
            type : String,
            required: true,
            unique: true
        },
        variant_success_count: {
            type: Object,
            properties: {
                A: {type: Number, default: 0, min: 0},
                B: {type: Number, default: 0, min: 0},
                C: {type: Number, default: 0, min: 0},
                ON: {type: Number, default: 0, min: 0},
                OFF: {type: Number, default: 0, min: 0},
            },
            required: true
        }
    },
    { collection: "goals" }
);

    module.exports = model("Goal", userSchema);
