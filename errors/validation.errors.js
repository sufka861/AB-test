class ValidationError extends Error {
  constructor(message) {
    super(message);
    this.name = this.constructor.name;
    this.status = 400;
  }
}

class MissingPropertyError extends ValidationError {
  constructor(property) {
    super(`Property: ${property} is missing...`);
    this.name = this.constructor.name;
    this.property = property;
  }
}

class InvalidProperty extends ValidationError {
  constructor(property) {
    super(`Property: ${property} is not valid`);
    this.name = this.constructor.name;
    this.property = property;
  }
}

class RegisterError extends ValidationError {
  constructor() {
    super(`Wrong email or password`);
  }
}

module.exports = {
  MissingPropertyError,
  InvalidProperty,
  ValidationError,
  RegisterError,
};
