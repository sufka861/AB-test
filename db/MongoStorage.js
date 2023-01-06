const mongoose = require("mongoose");
const {ObjectId} = require('mongodb');
mongoose.set("strictQuery", false);
const Path = require("path");
const validateDate = require("validate-date");


module.exports = class MongoStorage {
    constructor(entity) {
        this.entityName = entity.charAt(0).toUpperCase() + entity.slice(1);
        this.Model = require(Path.join(
            __dirname,
            `../models/${this.entityName}.model.js`
        ));
        this.connect();
    }

    connect() {
        const connectionUrl = `mongodb+srv://dcs_growth:${process.env.DB_PASSWORD}@${process.env.DB_CLUSTER}.x4zjwvd.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
        mongoose
            .connect(connectionUrl)
            .then(() => console.log(`connected to ${this.entityName} collection`))
            .catch((err) => console.log(`connection error: ${err}`));
    }

    find() {
        return this.Model.find({});
    }

    findGroup(key, value) {
        const obj = {};
        obj[key] = value;
        return this.Model.find({obj});
    }

    findByAccount(key, value) {
        const obj = {};
        const id = new ObjectId(value);
        obj[key] = id;
        return this.Model.find({obj});
    }

    findByDate(year, month) {
        const start = new Date(year, month, 1);
        const end = new Date(year, month, 31);
        if (validateDate(start) && validateDate(end)) {
            return this.Model.countDocuments({
                end_time: {
                    $gte: start,
                    $lte: end
                }
            });
        }
    }

    retrieve(id) {
        return this.Model.findById(id);
    }

    create(data) {
        const entity = new this.Model(data);
        return entity.save();
    }

    delete(id) {
        return this.Model.findByIdAndDelete(id);
    }

    update(id, data) {
        return this.Model.findByIdAndUpdate(id, data, {new: true});
    }
};
