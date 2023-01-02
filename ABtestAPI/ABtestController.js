const {checkAttributesAndReturnVariant} = require('ABtest');
module.exports = {
    getVariantByExperimentID : async (req, res) =>{
        const experimentID =- req.params.id;
        const endUserReq = req.body;

        if(experimentID && endUserReq)
            res.status(200).send({variant : checkAttributesAndReturnVariant(endUserReq, experimentID) });
        else
            res.status(404).send(null);

    }
}
