const { ObjectId } = require("bson");
const { Schema, model } = require("mongoose");

const userSchema = new Schema(
  {
    uuid: { type: String, required: true },
    experiments: [
      {
        experimantId: String,
        variant: {
          type: Map,
          of: String,
        },
      },
    ],
  },
  { collection: "users" }
);

module.exports = model("User", userSchema);
