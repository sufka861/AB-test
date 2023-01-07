const mongoose = require("mongoose");
const {ObjectId} = require('mongodb');
mongoose.set("strictQuery", false);
const Path = require("path");


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

    findByTwoAttributes(key, value, key2, value2) {
        const obj = {};
        obj[key] = value;
        if (key2 && value2) {
            obj[key2] = value2;
        }
        return this.Model.find(obj);
    }

    findByAttribute(key, value) {
        const obj = {};
        obj[key] = value;
        return this.Model.find(obj);
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
        return this.Model.findByIdAndUpdate(id, data, {new: true}, {runValidators: true});
    }
};
