const ABcheckAttributes = (endUserReq, experiment) => {
  const { A, B, C } = experiment.variants_ab;
  return returnByRatio({ A: A }, { B: B });
};

const returnByRatio = (optionA, optionB) => {
  return 0.5 < Math.random() ? optionA : optionB;
};

module.exports = {
  ABcheckAttributes,
};
