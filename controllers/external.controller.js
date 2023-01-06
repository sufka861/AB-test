const UsersRepository = require("./../repositories/user.repository");
const userRepository = new UsersRepository();
const {
  checkAttributes,
  getUserByUuid,
  setCookie,
  getCookie,
  addUser,
  insertExperiment,
  getUserExperiment,
} = require("./user.controller");

const doTest = async (req, res) => {
  // validate data (validation service?)

  const user = await getUserByUuid(req, res);
  console.log(user);
  if (user) {
    for (const exp of user.experiments) {
      if (exp.experimantId === req.body.experimentId) {
        res.status(200).json(exp.variant);
      }
    }
  }
  const isAttributesMatch = checkAttributes();

  // check user attributes (user controller + experiment controller)
  // if attributes dont match - end
  // save new user to db (user controller)
  // set a persistant cookie with the uuid (user controller)
  // determine if to test by experiment traffic(should allow)
  // get experiment type (experiment controller)
  // do the ab/ff test and return a variant (experiment controller/ a-b or f-f service)
  // update user with the experiment and variant (user controller)
  // return variant {A/B/C:"" / ON:true/OFF:true}
};

module.exports = { doTest };
