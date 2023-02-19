const featureCheckAttributes = (endUserReq, experiment) => {
  const { ON, OFF } = experiment.variantsFF;
  return { ON: ON };
};

module.exports = {
  featureCheckAttributes,
};
