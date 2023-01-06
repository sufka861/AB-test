const { ObjectId } = require("bson");
const { Schema, model } = require("mongoose");

const userSchema = new Schema(
  {
    uuid: { type: String, required: true },
    experiments: [
      { experimantId: String, variant: { A: String, B: String, C: String } },
    ],
  },
  { collection: "users" }
);

module.exports = model("User", userSchema);
