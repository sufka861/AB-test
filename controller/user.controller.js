const { v4: uuidv4, validate: uuidValidator } = require("uuid");
const {
  PropertyNotFound,
  EntityNotFound,
} = require("../errors/NotFound.errors");
const { InvalidProperty } = require("../errors/validation.errors");
const { ServerUnableError } = require("../errors/internal.errors");

const userRepository = require("../repositories/user.repository");

const getUserByUuid = async (req, res) => {
  const uuid = getCookie(req, res);
  if (!uuid) return false;
  const [user] = await userRepository.retrieveByUuid(uuid);
  if (!user) throw new EntityNotFound("user");
  return user;
};

const addUser = async (req, res) => {
  const uuid = generateUuid();
  if (!uuidValidator(uuid)) throw new InvalidProperty("uuid");
  const user = { uuid };
  const newUser = await userRepository.createUser(user);
  if (!newUser) throw new ServerUnableError("create");
  return newUser;
};

const insertExperiment = async (uuid, experiment) => {
  if (!uuid) throw new PropertyNotFound("uuid");
  if (!experiment.variant) throw new PropertyNotFound("variant");
  const response = await userRepository.retrieveByUuid(uuid);
  const user = response[0];
  if (!user) throw new ServerUnableError("update");
  if (!user.experiments) {
    user.experiments = [];
  }
  user.experiments.push(experiment);
  const updatedUser = await userRepository.updateUser(user._id, user);
  return updatedUser;
};

const getUserExperiment = (user) => {
  if (!user.experiments || user.experiments.length === 0) {
    return false;
  }
  return user.experiments;
};

const getCookie = (req, res) => {
  return req.cookies.uuid ? req.cookies.uuid : false;
};

const generateUuid = () => {
  return uuidv4();
};

const getAllUsers = async (req, res) => {
  res.status(200).json(await userRepository.find());
};

module.exports = {
  checkAttributes,
  getAllUsers,
  getUserByUuid,
  setCookie,
  getCookie,
  addUser,
  insertExperiment,
  getUserExperiment,
};
