
# Growth-Team 🙂

**Welcome to our part in SAAS-System!**

You can reuse the portrayal you used first because this section should not be long.)
How It Works? You can create and run the AB test and make a features of features according to the features you choose and the amount of traffic you will participate in the experiment.
You can see the statistics of each experiment depending on the amount of participants while running and at the end of the project.
The purpose of this project is to identify any change in the webpage to maximize or increase the result of the matter. An example can be identifying the clicks lesson for a banner ad.

> **Build Status**

> **Code Style**

> **Features**
> **API reference**



> **Installation**

> **Before you start**
1. [x] Download the code from Git-Hub https://github.com/sufka861/AB-test.git
2. [x] Cd to the working directory and start the server using the following command in the terminal - $node app.js
3. [x] Open a browser page and go to https://ab-test-bvtg.onrender.com/
4. [x] Make sure you have our .env file containing the sensitive info of our system account.
5. [x] Open a browser page and go to https://ab-test-bvtg.onrender.com/
6. [x] Full documentation of the API calls can be seen at: https://documenter.getpostman.com/view/24139741/2s8Z711C7C
7. [x] Make sure to install npm packages as described in the package.json:
   8.[x] body-parser
   9.[x] bson
   10.[x] cookie-parser
   11.[x] cors
   12.[x] dotenv
   13.[x] eslint
   14.[x] express
   15.[x] express-async-errors
   16.[x] geoip-lite
   17.[x] moment
   18.[x] mongodb
   19.[x] mongoose
   15.[x] morgan
   16.[x] newrelic
   17.[x] node-cron
   18.[x] request-ip
   19.[x] sinon
   20.[x] ua-parser-js
   21. [x] uuid
   22. [x] validate-date
   23. [x] winston

> **Features**
1. [x] Using the calls to the render website via Postman you can create and start AB test / Feature Flag experiments.
2. [x] View lists of exist experiments and planned future experiments.
3. [x] app.js – http – the entry point of the system
4. [x] Router folder – consists of a map of all the API points for both server and client
5. [x] Controllers – direct the functionality of the system6.
6. [x] Services – contain the business logic of the system.
7. [x] Data Base – MongoDB.
8. [x] Checkout Our Api Documentation : 
9. [x] http calls logger - configured in the middleware directory, writes call logs inside logs folder, filename: http.log
10.[x] error logs - configured in the middleware directory, writes call logs inside logs folder, filename: error.log. operates from the errorHandler middleware (info will follow)
11.[x] error handler - consists of 3 parts:
   - express-async-errors package - wraps the controllers in try/catch statement automatically (no implementation needed), and calls the next(error) function in the catch block with the error thrown. the next function will "fall" into the errorHandler.
   - errorHandler - a function that is used at the end of the server that catches all the errors thrown in the controllers
   - Custom Errors - in the errors' directory. Classes that extends Error class, with status and message to pass to the error handier at the end. More can be added if we need them.

> **How to Use**
* The system front end is done by the core team and will be fully integrated with the system on the next phase. The system can be checked by calls to the API as mentioned in the documentation can be done by the system end user. The following instructions regard the future implemented user interface.
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
* Ilai Azulay
Wish you happy Experiments: DCS Growth Team

