const UsersRepository = require("./../repositories/user.repository");
const userRepository = new UsersRepository();

const doTest = (req, res) => {
  // validate data
  // generate uuid (user controller)
  // set cookie (user controller)
  // check attributes (ab service)
  // ** insert user to db (user controller)
  // ** determine if to test (ab service - should allow)
  // **** check experiment type from body (external controller)
  // **** send to a test and get a variant (experiment controller)
  // **** insert variant to user db(user conroller)
  // **** return variant (experiment controller)
};
