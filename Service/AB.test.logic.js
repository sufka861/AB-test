const { returnByRatio } = require("./utils");

const ABcheckAttributes = (endUserReq, experiment) => {
  const { A, B, C } = experiment.variants_ab;
  return returnByRatio({ A: A }, { B: B });
};

module.exports = {
  ABcheckAttributes,
};
