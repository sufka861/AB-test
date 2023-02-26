const { Schema, model, ObjectId } = require("mongoose");

const userSchema = new Schema(
  {
    uuid: { type: String, required: true },
    experiments: [
      {
        experimentId: ObjectId,
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
