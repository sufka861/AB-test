const ABcheckAttributes = (experiment) => {
  const { A, B, C } = experiment.variantsAB;
  return returnByRatio({ A: A, tested: true }, { B: B, tested: true });
};

const returnByRatio = (optionA, optionB) => {
  return 0.5 < Math.random() ? optionA : optionB;
};

module.exports = {
  ABcheckAttributes,
  returnByRatio
};
