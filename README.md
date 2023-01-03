# Initial Server
## Running the server
1. install npm packages:
```
npm i
```
2. Run the server:
```
npm run dev
```

## Server Features and information:
1. **http calls logger** - configured in the middleware directory, writes call logs inside logs folder, filename: http.log
2. **error logs** - configured in the middleware directory, writes call logs inside logs folder, filename: error.log. operates from the errorHandler middleware (info will follow)
3. **error handler** - consists of 3 parts:
    - **express-async-errors** package - wraps the controllers in try/catch statement automatically (no implementation needed), and calls the next(error) function in the catch block with the error thrown. the next function will "fall" into the errorHandler.
    - **errorHandler** - a function that is used at the end of the server that catches all the errors thrown in the controllers
    - **Custom Errors** - in the errors directory. Classes that extands Error class, with status and message to pass to the error hander at the end. More can be added if we need them.
4. **body-validator**- for controllers, when we want to validate if body was sent. if any body was sent (no property validation at this point) will return true. else, will throw a custom error
5. **Mongo Storage class** - as david showed us in the restaurant app, so repositories should be written accordingly.
