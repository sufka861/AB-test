const featureCheckAttributes = (endUserReq, experiment) => {
  console.log(experiment);
  const { ON, OFF } = experiment.variantsFF;
  return { ON: ON, tested: true };
};

module.exports = {
  featureCheckAttributes,
};
