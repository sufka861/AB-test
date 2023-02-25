const featureCheckAttributes = (endUserReq, experiment) => {
  const { ON, OFF } = experiment.variantsFF;
  return { ON: ON, tested: true };
};

module.exports = {
  featureCheckAttributes,
};
