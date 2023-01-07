const { updateUser } = require("../repositories/user.repository");
const usersRepository = require("../repositories/user.repository");
const {
  getUserByUuid,
  addUser,
  insertExperiment,
  getUserExperiment,
} = require("./user.controller");
const { checkAttributes } = require("./../Service/utils");

const runTest = async (req, res) => {
  // validate data (validation service?)
  const user = await getUserByUuid(req, res);
  if (user) {
    const exp = getUserExperiment(user, req.body.experimentId);
    if (exp) {
      res.status(200).json(exp.variant);
    }
    const existingVariant = doExperiment(req.body.experimentId, user.uuid);
    res.status(200).json(existingVariant);
  }

  if (checkAttributes(req, req.body.experimentId)) {
    const newUser = await addUser(req, res);
    res.cookie("uuid", newUser.uuid, { maxAge: 900000, httpOnly: true });
    const variant = await doExperiment(req.body.experimentId, newUser.uuid);
    console.log(variant);
    res.status(200).json(variant);
  }
  res.status(200).json({ message: "user does not match attributes" });
};

const doExperiment = async (experimentId, uuid) => {
  let variant = checkExperimentTypeAndExecExperiment(experimentId, req);
  const userExperiment = { experimentId, variant };
  const updatedUser = await insertExperiment(uuid, userExperiment);
  return variant;
};

module.exports = { runTest };
