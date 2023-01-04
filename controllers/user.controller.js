const { v4: uuidv4 } = require("uuid");
const {
  PropertyNotFound,
  EntityNotFound,
} = require("./../errors/NotFound.errors");

const UsersRepository = require("./../repositories/user.repository");
const userRepository = new UsersRepository();

const generateUuid = () => {
  return uuidv4();
};
const checkAttributes = (req, res) => {};
const getUserByUuid = (req, res) => {
  const uuid = getCookie(req, res);
  if (!uuid) throw new PropertyNotFound("cookie");
  const user = userRepository.retrieveByAttribute(uuid);
  if (!user) throw new EntityNotFound("user");
  return user;
};
const setCookie = (uuid) => {
  const uuid = generateUuid();
  res.cookie("uuid", uuid, { maxAge: 900000, httpOnly: true });
};

const getCookie = (req, res) => {
  return res.cookies.uuid;
};

module.exports = {
  generateUuid,
  checkAttributes,
  getUserByUuid,
  setCookie,
};
