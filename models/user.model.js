// Add user achema
const { ObjectId } = require("bson");
const { Schema, model } = require("mongoose");
// uuid
// experiments {id, variant}

const userSchema = new Schema(
  {
    uuid: { type: String, required: true },
    experiments: [{ experimantId: ObjectId, variant: String }],
  },
  { collection: "users" }
);

module.exports = model("User", userSchema);
