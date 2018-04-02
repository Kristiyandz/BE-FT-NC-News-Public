# NORTHCODERS NEWS API

This project was designed to access Northcoders news, articles, users and more.
## Getting started

Below you can find a link which will display all of the available ***API Endpoints***

* Link to NC-News API - https://ncnewsapp.herokuapp.com/

## Prerequisites
This application was build with JavaScript as the main language and combination of various technologies such as:
 * [MongoDB](https://www.mongodb.com/)
 * [Node.js](https://nodejs.org/en/)
 * [Express](https://expressjs.com/)
 * [MLab](https://mlab.com/)
 * [Heroku](https://heroku.com/)

## Installation

First you need to download the project.
Open your terminal and copy and paste the following command:
```
git clone https://github.com/Kristiyandz/BE-FT-northcoders-news.git
```
After that we need our dependencies.
Type the following command to download the package.json file
```
npm init -y
```
The rest of the packages we will need we can download with a single command. Type the following and save them as dev dependencies with -D at the end.
```
npm i mocha chai faker nodemon supertest -D
```
Once all of the packages are set, click on this demo and play around:

https://ncnewsapp.herokuapp.com/api/topics/coding/articles

Instead of ***cooking*** in the url, try ***football*** or ***coding*** and see what happens.

## Running the tests
The test suite was build using the Mocha test framework, including Chai and Supertest.

For more info on the Mocha framework and documentation visit:
* [Mocha](https://mochajs.org/)

There are 24 written tests in the ***spec*** folder.
Simply run this command in the terminal to execute the test suite:
```
npm t
```
Each test is written to check different endpoints of the API.
We are testing our code because we want to find out if there are defects in our code and fix them.

## Seeding the databases

To seed the development database, run this command:
```
npm run seed:dev
```
To seed the production database on Mlab, do this:
* Create an [MLab](https://mlab.com/) account
* Open the package.json file and in the "scripts" section add ***seed:prod***, edit the ***<db_url>*** and place your username and password from Mlab.

Then run this command to seed into Mlab:

```
npm run seed:prod
```
This will update the database hosted on Mlab.

## Deployment
### Mlab
* Create an account on [MLab](https://mlab.com/)
* Create a new database
* Create user for the DB
* Get the URI for the config and add the user and password in the URI

### Heroku
* Create account for [Heroku](https://heroku.com/)
* In the root folder, where you have downloaded this project, in the integrated terminal type:
```
heroku create
```
* Set the DB_URL for the heroku config variables in the integrated terminal with the command
```
heroku config:set DB_URL=[Mlab-db-url]
```
replacing ***mlab-db-url*** with the url from Mlab.
* Then deploy the app using
```
git push heroku master
```
to send the app to heroku.

To view the app simply type
```
heroku open
```
and to view logs and errors type
```
heroku logs --tail
```
## Author
* ### [Kristiyandz](https://github.com/Kristiyandz)

## Acknowledgments
* The [Northcoders](https://northcoders.com/) team



