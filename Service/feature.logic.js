const featureCheckAttributes = (endUserReq, experiment) => {
  const { ON, OFF } = experiment.variants_ff;
  return { ON: ON };
};

module.exports = {
  featureCheckAttributes,
};
