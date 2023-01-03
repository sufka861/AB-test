class BadRequest extends Error {
  constructor(message) {
    super(message);
    this.name = this.constructor.name;
    this.status = 400;
  }
}

class PropertyExist extends BadRequest {
  constructor(property) {
    super(`${property} already exist`);
    this.name = this.constructor.name;
    this.property = property;
  }
}

class BodyNotSent extends BadRequest {
  constructor() {
    super("No properties sent");
    this.name = this.constructor.name;
  }
}

module.exports = { PropertyExist, BodyNotSent };
