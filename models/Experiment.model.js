const { Schema, model, ObjectId, isValidObjectId } = require("mongoose");
const iso = require("iso-3166-1"); // used to validate country code

const experimentSchema = new Schema(
    {
        name: {type: String, required: true},
        account_id: {type: ObjectId, required: true},
        type: {
            type: String,
            enum: ["f-f", "a-b"],
            required: true,
        },
        test_attributes: {
            location: {
                type: [{
                    locationName: String,
                    locationCount: {type: Number, default: 0, min: 0},
                }],
                validate: {
                    validator: countryValidator,
                    message: () => `Invalid country code`,
                },
            },
            device: {
                type: [{
                    deviceName: String,
                    deviceCount: {type: Number, default: 0, min: 0},
                }],
                validate: {
                    validator: deviceValidator,
                    message: () => `Invalid device`,
                },
                lowercase: true,
                trim: true,
            },
            browser: {
                type: [{
                    browserName: String,
                    browserCount: {type: Number, default: 0, min: 0},
                }],
            },
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
