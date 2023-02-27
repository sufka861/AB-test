const { v4: uuidv4, validate: uuidValidator } = require("uuid");
const {
  PropertyNotFound,
  EntityNotFound,
} = require("../errors/NotFound.errors");
const { InvalidProperty } = require("../errors/validation.errors");
const { ServerUnableError } = require("../errors/internal.errors");

const userRepository = require("../repositories/user.repository");

const getUserByUuidController = async (req,res) => {
  const uuid = req.params.uuid;
  const [user] = await userRepository.retrieveByUuid(uuid);
  if (!user) throw new EntityNotFound("user");
  res.status(200).json(user);
}


const addUser = async (next) => {
  try{
  const uuid = generateUuid();
  if (!uuidValidator(uuid)) throw new InvalidProperty("uuid");
  const user = { uuid };
  const newUser = await userRepository.createUser(user);
  if (!newUser) throw new ServerUnableError("create");
  return newUser;
  } catch(error) {
    next(error)
  }
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
  return await userRepository.updateUser(user._id, user);
};

const getUserExperiment = (user) => {
  if (!user.experiments || user.experiments.length === 0) {
    return false;
  }
  return user.experiments;
};


const generateUuid = () => {
  return uuidv4();
};

const getAllUsers = async (req, res) => {
  res.status(200).json(await userRepository.find());
};

module.exports = {
  getAllUsers,
  getUserByUuidController,
  addUser,
  insertExperiment,
  getUserExperiment,
  generateUuid
};
