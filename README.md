
# Growth-Team 🙂

**Welcome to our part in SAAS-System!**

Here is the crux of the system, you can create AB test experiments and feature flag for each population
on which you would like to run the experiment and what percentage of the population will participate in the experiment. In addition to each experiment, specific conditions can be defined regarding the participants in the experiment.
You can perform the experiment, schedule it and view the results of the experiment while running.

> **Before you start**

1. [x] Make sure you have our .env file containing the sensitive info of our system account.
2. [x] Make sure to install npm packages as described in the package.json:
   a. Dotenv
   b. Morgan
   c. Node-cron
   d. Node scheduled
   f. Nodemailer
   g. Uuid
   h.geoip-lite
   i.ua-parser-js
   j. request-ip
3. [x] Download the code from Git-Hub https://github.com/sufka861/AB-test.git
4. [x] Cd to the working directory and start the server using the following command in the terminal - $node server.js
5. [x] Open a browser page and go to https://.onrender.com

> **Basic Information**

1. [x] From the homepage you can start create AB test / Feature Flag experiments.
2. [x] View lists of exist experiments and planned future experiments.
3. [x] Server.js – http – the entry point of the system
4. [x]  Router.js – consists of a map of all the API points for both server and client
5. [x] Controllers – direct the functionality of the system6.
6. [x] Services – contain logic of the functions.
7. [x] Data Base – MongoDB.
8. [x] Front – HTML/CSS/JS
9. [x] Checkout Our Api Documentation : 
10.[x] http calls logger - configured in the middleware directory, writes call logs inside logs folder, filename: http.log
11. [x] error logs - configured in the middleware directory, writes call logs inside logs folder, filename: error.log. operates from the errorHandler middleware (info will follow)
12.[x] error handler - consists of 3 parts:
   - express-async-errors package - wraps the controllers in try/catch statement automatically (no implementation needed), and calls the next(error) function in the catch block with the error thrown. the next function will "fall" into the errorHandler.
   - errorHandler - a function that is used at the end of the server that catches all the errors thrown in the controllers
   - Custom Errors - in the errors' directory. Classes that extends Error class, with status and message to pass to the error handier at the end. More can be added if we need them.
13. [x] body-validator- for controllers, when we want to validate if body was sent. if anybody was sent (no property validation at this point) will return true. else, will throw a custom error

> **How to Use**

`Create AB Test Experiment:`

1. Open Homepage.html.
2. Go to "New Experiment"
3. Fill all in the fields in the form:
    * Name
    * Type - choose A/B test.
    * Duration
    * choose 3 attributes.
    * traffic
    * variants - 2
4. Click on "Create" button.
5. A message show "Your Experiment has been successfully saved"
6. Go to "Manage Experiments" and check that the experiment that you creat appears.
7. check the type experiment is A/B test.

`Create Feature Flag Experiment:`

1. Open Homepage.html.
2. Go to "New Experiment"
3. Fill all in the fields in the form:
   * Name
   * Type - choose Feature Flag.
   * Duration
   * choose 3 attributes.
   * traffic
   * variants - 3
   * goal
4. Click on "Create" button.
5. . A message show "Your Experiment has been successfully saved"
6. Go to "Manage Experiments" and check that the experiment that you creat appears.
7. check the type experiment is Feature Flag.

`Edit Experiment:`

1. Open Homepage.html.
2. Go to "Mange Experiment" page.
3. choose an exist experiment and click on "Edit" button.
4. Open Edit Experiment page.
5. Delete one of the Values in the form (leave it empty)
6. Click on "Update" button.
7. Go to "Manage Experiments" and check that change that you make has been changed in the experiment.


`Experiment Status:`

1. Open Homepage.html.
2. Go to "Edit Experiment" page and create new experiment that start time in the current time.
3. Go to "Mange Experiment" page.
4. Check that the experiment status is "Active"
5. Click on "Terminated" button.
6. Check that the experiment status changed to "Terminated".

`Experiment Duration:`

1. Open Homepage.html.
2. Go to "New Experiment"
3. Fill all in the fields in the form:
   * Name
   * Type 
   * Duration -  set the start time and the end time for tomorrow.
   * choose 3 attributes.
   * traffic
   * variants 
   * goal
4. Click on "Create" button.
5. A message show "Your Experiment has been successfully saved"
6. Go to "Manage Experiments" and check that the experiment that you creat appears.
7. Check the that the experiment status is planing.
8. Check again the experiment status tomorrow and make sure that the status is changed to active.
9. Check again the experiment status the day after tomorrow and make sure the status changed to ended.

`Experiment Statics:`

1. Open Homepage.html.
2. Create new experiment.
3. Go to "Manage Experiment" .
NOTE: if you created AB test Experiment make sure you have 3 variants,if you created Feature Flag you have 2 variants.
4.  Make sure that from the beginning of the experiment to the end the variants values changed.

`Error Handling:`

1. All errors that might occur on server side are directed to an error handling function.
2. console.error function is redirected to write to log file
3. Special 404 page will show and redirect back to home page if the router is given a wrong path.
4. 404 page is server side rendered.
5. Try accessing an invalid address in the url and see for yourself ;)

> **Group members 😇**

* Suf Karmon
* Pe'er Fichman
* Shir Amar
* Mohamad Aboria
* Adva Apelboim

Wish you happy Experiments: DCS Growth Team

