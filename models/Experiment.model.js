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
    },
    reqCounter: {
        type: Number,
        default: 0,
        validate: {
            validator: (counter) => counter >= 0 && counter % 1 === 0,
            message: 'counter value must be a positive whole number'
        }
    }
})


const experimentSchema = new Schema(
    {
        name: {type: String, required: true},
        accountId: {type: ObjectId, required: true},
        type: {
            type: String,
            enum: ["f-f", "a-b"],
            required: true,
        },
        testAttributes: {
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
        },
        trafficPercentage: {type: Number, min: 0, max: 100, required: true},
        callCount: {type: Number, default: 0, min: 0, required: true},
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
                startTime: Date,
                endTime: Date,
            },
            required: true,
            validate: {
                validator: (duration) => {
                    return duration.endTime > duration.startTime;
                },
                message: "Start time should be prior to end time",
            },
        },
        variantsAB: {
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
        variantsFF: {
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
                validator: (goals) => goals.length > 0 && goals.every(isValidObjectId),
                message: "There Must be at least one goal, all goals must be of type mongoose objectId"
            },
            ref: 'Goal'
        }
    },
    {
        collection: "experiments"
    }
);

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
