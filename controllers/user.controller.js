const { v4: uuidv4, validate: uuidValidator } = require("uuid");
const {
  PropertyNotFound,
  EntityNotFound,
} = require("./../errors/NotFound.errors");
const { InvalidProperty } = require("./../errors/validation.errors");
const { bodyValidator } = require("./../validators/body.validator");
const { ServerUnableError } = require("./../errors/internal.errors");

const UsersRepository = require("../repositories/user.repository");
const userRepository = new UsersRepository();

const checkAttributes = (req, res) => {};

const getUserByUuid = (req, res) => {
  const uuid = getCookie(req, res);
  if (!uuid) return false;
  const user = userRepository.retrieveByUuid(uuid);
  if (!user) throw new EntityNotFound("user");
  return user;
};

const addUser = async () => {
  const uuid = generateUuid();
  if (!uuidValidator(uuid)) throw new InvalidProperty("uuid");
  const user = { uuid };
  const newUser = await userRepository.create(user);
  if (!newUser) throw new ServerUnableError("create");
  res.status(200).json({ newUser });
  return newUser;
};

const insertExperiment = async (uuid, experiment) => {
  if (!experiment.uuid) throw new PropertyNotFound("uuid");
  if (!experiment.variant) throw new PropertyNotFound("variant");
  const user = await userRepository.retrieveByUuid(uuid);
  if (!user) throw new ServerUnableError("update");
  user.experiments.push(experiment);
  const updatedUser = await userRepository.update(user);
  return updatedUser;
};

const getUserExperiment = async (user, experimentId) => {
  const { experiments } = user;
  for (const exp of experiments) {
    if (exp.id === experimentId) return exp;
  }
  return false;
};

const setCookie = () => {
  const uuid = generateUuid();
  res.cookie("uuid", uuid, { maxAge: 900000, httpOnly: true });
};

const getCookie = (req, res) => {
  return req.cookies.uuid ? req.cookies.uuid : false;
};

const generateUuid = () => {
  return uuidv4();
};

module.exports = {
  checkAttributes,
  getUserByUuid,
  setCookie,
  getCookie,
  addUser,
  insertExperiment,
  getUserExperiment,
};
