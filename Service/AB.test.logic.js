const ABcheckAttributes = (endUserReq, experiment) => {
  const { A, B, C } = experiment.variantsAB;
  return returnByRatio({ A: A }, { B: B });
};

const returnByRatio = (optionA, optionB) => {
  return 0.5 < Math.random() ? optionA : optionB;
};


module.exports = {
  ABcheckAttributes,
  returnByRatio
};
