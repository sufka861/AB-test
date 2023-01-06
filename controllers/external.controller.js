const UsersRepository = require("./../repositories/user.repository");
const userRepository = new UsersRepository();
const {
  checkAttributes,
  getUserByUuid,
  addUser,
  insertExperiment,
  getUserExperiment,
} = require("./user.controller");

const runTest = async (req, res) => {
  // validate data (validation service?)
  const user = await getUserByUuid(req, res);
  console.log(user);
  if (user) {
    const exp = getUserExperiment(user, req.body.experimentId);
    if (exp) {
      res.status(200).json(exp.variant);
    }
    const existingVariant = doExperiment(req.body.experimentId, user.uuid);
    res.status(200).json(existingVariant);
  }

  const isAttributesMatch = checkAttributes(req.body.attributes);
  if (!isAttributesMatch) {
    res.status(200).json({ message: "attributes does not match" });
  }
  const newUser = await addUser();
  res.setCookie("uuid", newUser.uuid, { maxAge: 900000, httpOnly: true });
  const variant = doExperiment(req.body.experimentId, newUser.uuid);
  res.status(200).json(variant);
};

const doExperiment = async (experimentId, uuid) => {
  const experiment = await getExperimentById();
  let variant;
  if (experiment.type === "f-f") {
    variant = doFF();
  }
  if (experiment.type === "a-b") {
    variant = doAB();
  }
  const userExperiment = { experimentId, variant };
  const updatedUser = await insertExperiment(uuid, experiment);
  return variant;
};

module.exports = { runTest };
