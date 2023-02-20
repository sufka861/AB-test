const {Schema, model, ObjectId} = require("mongoose");
const iso = require("iso-3166-1"); // used to validate country code

const attributeSchema = new Schema({
    key: {
        type: String,
        unique: true,
        required: true,
    },
    value: {
        type: [String],
        validate: {
            validator: (values) => values.length > 0,
            message: "At least one value must be provided"
        }
    }
})


const experimentSchema = new Schema(
        {
            name: {type: String, required: true},
            account_id: {type: ObjectId, required: true},
            type: {
                type: String,
                required: true,
                validate: [
                    experimentTypeValidator,
                    (type) => `${type.value} is not a valid type`,
                ],
            },
            test_attributes: {
                location: {
                    type: [String],
                    validate: {
                        validator: countryValidator,
                        message: () => `Invalid country code`,
                    },
                },
                device: {
                    type: [String],
                    validate: {
                        validator: deviceValidator,
                        message: () => `Invalid device`,
                    },
                    lowercase: true,
                    trim: true,
                },
                browser: [String],
                custom_attributes: {
                    type: [attributeSchema],
                    default: null,
                }
            },
            variant_success_count: {
                type: Object,
                properties: {
                    A: {type: Number, default: 0, min: 0},
                    B: {type: Number, default: 0, min: 0},
                    C: {type: Number, default: 0, min: 0},
                    ON: {type: Number, default: 0, min: 0},
                    OFF: {type: Number, default: 0, min: 0},
                },
                validate: {
                    validator: function (variants_success_count) {
                        let variantsSum = 0;
                        for (const variant in variants_success_count) {
                            variantsSum += variants_success_count[variant];
                        }
                        return variantsSum <= this.call_count;
                    },
                    message: "Variants total count must be lesser then or equal call count"
                }
            },
            traffic_percentage: {type: Number, min: 0, max: 100, required: true},
            call_count: {type: Number, default: 0, min: 0, required: true},
            status: {
                type: String,
                required: true,
                enum: {
                    values: ["active", "ended", "terminated", "planned"],
                    message: `{VALUE} is not a valid status.`,
                },
            },
            duration: {
                type: Object,
                properties: {
                    start_time: Date,
                    end_time: Date,
                },
                required: true,
                validate: {
                    validator: (duration) => {
                        return duration.end_time > duration.start_time;
                    },
                    message: "Start time should be prior to end time",
                },
            },
            variants_ab: {
                type: Object,
                properties: {
                    A: String,
                    B: String,
                    C: String,
                },
                required: function () {
                    return this.type === "a-b";
                }
            },
            variants_ff: {
                type: Object,
                properties: {
                    ON: {
                        type: Boolean,
                        default: true,
                        validate: {
                            validator: (ON) => ON,
                            message: "Feature flag variant ON must be true",
                        },
                    },
                    OFF: {
                        type: Boolean,
                        default: false,
                        validate: {
                            validator: (OFF) => !OFF,
                            message: "Feature flag variant OFF must be false",
                        },
                    },
                },
                required: function () {
                    return this.type === "f-f";
                },
            },
            goals: {
                type: [ObjectId],
                validate: {
                    validator: (goals) => goals.length() > 0 && goals.every(ObjectId.isValid),
                    message: "There Must be at least one goal, all goals must be of type mongoose objectId"
                },
                ref: 'Goal'
            }
        },
        {
            collection: "experiments"
        }
    )
;

function experimentTypeValidator(type) {
    type = type.toLowerCase();
    return type === "a-b" || type === "f-f";
}

function deviceValidator(devices) {
    const devicesSet = new Set([
        "console",
        "mobile",
        "tablet",
        "smarttv",
        "wearable",
        "embedded",
        "desktop",
    ]);
    return devices.every((device) => devicesSet.has(device.toLowerCase()));
}

function countryValidator(countries) {
    return countries.every((country) => !!iso.whereAlpha2(country));
}

module.exports = model("Experiment", experimentSchema);
