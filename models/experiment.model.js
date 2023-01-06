const {Schema, model, ObjectId} = require('mongoose');
const iso = require('iso-3166-1'); // used to validate country code


const experimentSchema = new Schema({
        name: {type: String, required: true},
        account_id:{ type: ObjectId, required: true},
        type: {
            type: String,
            required: true,
            validate: [experimentTypeValidator, (type) => `${type.value} is not a valid type`]
        },
        test_attributes: {
            location: {
                type: [String],
                validate: {
                    validator: countryValidator,
                    message: () => `Invalid country code`
                }
            },
            device: {
                type: [String],
                validate: {validator: deviceValidator, message: () => `Invalid device`},
                lowercase: true,
                trim: true
            },
            browser: [String],
        },
        variant_success_count: {
            A: {type: Number, default: 0, min: 0},
            B: {type: Number, default: 0, min: 0},
            C: {type: Number, default: 0, min: 0},
        },
        traffic_percentage: {type: Number, min: 0, max: 100, required: true},
        call_count: {type: Number, default: 0, min: 0, required: true},
        status: {
            type: String, required: true,
            enum: {
                values: ["active", "ended", "terminated", "planned"],
                message: `{VALUE} is not a valid status.`,
            }
        },
        start_time: {
            type: Date, required: true,
            validate: {
                validator: function (startTime) {
                    return new Date(startTime) < new Date(this.end_time);
                },
                message: "Start time should be prior to end time"
            }

        },
        end_time: {
            type: Date, required: true,
            validate: {
                validator: function (endTime) {
                    return new Date(endTime) > new Date(this.start_time);
                },
                message: "End time should be after start time"
            }
        },
        variants_ab: {
            type: Object,
            properties: {
                A: String,
                B: String,
                C: String
            },
            required: function () {
                return this.type === "a-b"
            },
            variants_ff: {
                type: ObjectId,
                properties: {
                    ON: Boolean,
                    OFF: Boolean
                },
                validate :{
                    validator : (variants) =>{
                        return variants.ON !== variants.OFF;
                    },
                    message: "Feature flag variants must be of different values."
                },
                required: function () {
                    return this.type === "f-f";
                }

            }

        },
    }, {collection: "experiments"}
)



function experimentTypeValidator(type) {
    type = type.toLowerCase();
    return type === "a-b" || type === "f-f";
}


function deviceValidator(devices) {
    const devicesSet = new Set(["console", "mobile", "tablet", "smarttv", "wearable", "embedded", "desktop"]);
    return devices.every((device) => devicesSet.has(device.toLowerCase()));
}

function countryValidator(countries) {
    return countries.every((country) => !!iso.whereAlpha2(country));
}

module.exports = model("Experiment", experimentSchema);

