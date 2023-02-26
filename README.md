
# Growth-Team 🙂

**Welcome to our part in SAAS-System!**

We are a team that is part of a SAAS-System The system was built by several teams, each team has a part for which it is 
responsible for the system. We are responsible for the logic of the system.
You can create and run experimentAB and Feature Flag tests  according to attributes you choose and the amount of traffic
that will participate in the experiment,decide on the variants for the user,get access to the goals and to the call witch
mad by each account and experiments.
You can see the statistics of each experiment according to the number of participants during the run and at the end of the project.
The purpose of this project is to identify any changes to the web page to maximize or increase the result of interest.

The client gets SDK to implement our code in their system and make calls to our API routes.

 > **Before you start**
1. [x] Download the code from Git-Hub https://github.com/sufka861/AB-test.git
2. [x] Cd to the working directory and start the server using the following command in the terminal - $node app.js
3. [x] Make sure to install all the dependencies  as described in the package.json [npm install].
4. [x] Make sure you have our .env file containing the sensitive info of our system account.
5. [x] You can check our systm by using the UI - Open a browser page and go to https://core-team-final-assignment.onrender.com

> **API reference**

Full documentation of the API calls can be seen at: https://documenter.getpostman.com/view/24150243/2s93CPrCUY


> **Instructions**
1. [x] Using the calls to the render website via Postman you can create and start AB test / Feature Flag experiments.
2. [x] View lists of exist experiments and planned future experiments.
3. [x] app.js  – the entry point of the system
4. [x] Router – consists of a map of all the API points for both server and client
5. [x] Controllers – direct the functionality of the system6.
6. [x] Services – contain the business logic of the system.
7. [x] Data Base – MongoDB.
8. [x] repositories .
9. [x] middleware – contain all the error logs - writes call logs inside logs.
    - http calls logger - configured in the middleware directory, writes call logs inside logs folder, filename: http.log
    - error handler - consists of 3 parts:
      - express-async-errors package - wraps the controllers in try/catch statement automatically (no implementation needed), and calls the next(error) function in the catch block with the error thrown. the next function will "fall" into the errorHandler.
      - errorHandler - a function that is used at the end of the server that catches all the errors thrown in the controllers
      - Custom Errors - in the errors' directory. Classes that extends Error class, with status and message to pass to the error handier at the end. More can be added if we need them.
10.[x] models – contain the schemas  that connects to the database through mongoose.

> **Tests**

 All tests were done using Mocha,Chai and sinos.
you can find all the tests under the folder "test".
 use [npm run test] to run all the test and check coverage and results.

> **How to Use**

As we mentioned, we are responsible for the logic in the system, the UI development of the system is done by the Core team, we are responsible for the following 
features that can be tested by using the UI.
Below are the features in the system for which we were responsible and an explanation of their use

`Create AB Test Experiment:`
1. Open Homepage.
2. Go to "New Experiment"
3. Fill all in the fields in the form:
    * Name
    * Type - choose A/B test.
    * Duration
    * choose 3 attributes and costume attribute. 
    * traffic
    * variants - 2
4. Click on "Create" button.
5. A message show "Your Experiment has been successfully saved"
6. Go to "Manage Experiments" and check that the experiment that you creat appears.
7. check the type experiment is A/B test.

`Create Feature Flag Experiment:`

1. Open Homepage.
2. Go to "New Experiment"
3. Fill all in the fields in the form:
   * Name
   * Type - choose Feature Flag.
   * Duration
   * choose 3 attributes and costume attribute.
   * traffic
   * variants - 3
   * goal
4. Click on "Create" button.
5. . A message show "Your Experiment has been successfully saved"
6. Go to "Manage Experiments" and check that the experiment that you creat appears.
7. check the type experiment is Feature Flag.

`Edit Experiment:`

1. Open Homepage.
2. Go to "Mange Experiment" page.
3. choose an exist experiment and click on "Edit" button.
4. Open Edit Experiment page.
5. Delete one of the Values in the form (leave it empty)
6. Click on "Update" button.
7. Go to "Manage Experiments" and check that change that you make has been changed in the experiment.

`Experiment Status:`

1. Open Homepage.
2. Go to "Edit Experiment" page and create new experiment that start time in the current time.
3. Go to "Mange Experiment" page.
4. Check that the experiment status is "Active"
5. Click on "Terminated" button.
6. Check that the experiment status changed to "Terminated".

`Experiment Duration:`

1. Open Homepage.
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

1. Open Homepage.
2. Create new experiment.
3. Go to "Manage Experiment" .
NOTE: if you created AB test Experiment make sure you have 3 variants,if you created Feature Flag you have 2 variants.
4.  Make sure that from the beginning of the experiment to the end the variants values changed.

`Exclusive Account:`

 The account have the option to choose - Does each experiment stand by itself and only one experiment
will appear for each.

`Inclusive Account:`

This means that every customer has a lot of experiments
And all the experiments together can be together for all the users who see them.

> **Group members 😇**

* Suf Karmon
* Pe'er Fichman
* Shir Amar
* Mohamad Aboria
* Adva Apelboim
* Ilai Azulay

Wish you happy Experiments: DCS Growth Team

