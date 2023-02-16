
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
        },
        success_count: {
            type : Number,
            default: 0,
            validate:{
                validator: (count) => count >= 0 && count % 1 === 0,
                message: "Success count must be a positive whole number"
            },
            required:true
        }
    },
    { collection: "goals" }
);

    module.exports = model("Goal", userSchema);
