<p align="center"><img src="./screenshots/0.png" width=200  align="center"></p>
<h1 align="center">Havo</h1>
<p align="center"><img align="center" src="https://api.travis-ci.com/travis-ci/travis-web.svg" alt="build:passed"></p>

# Getting started

The backend written in Node JS for mobile application which is used to convert handwriting to speech via Machine Learning Library. This application is for the people who are unable to speak, by helping them save their daily conversation in the form of phrases. The server provides authentication via email OTP and JSON Web Token to help the user to secure their data. User can log on to multiple devices and stay logged in for a longer period of time.

[🔥 Live Version](https://havobackend.herokuapp.com)

# Project setup

To get the Node server running locally:

- Clone this repo
- `yarn` to install all required dependencies
- `yarn run dev` to start the local server

# Frontend Application

The mobile appliction which uses heroku

[🔥 Live Version](https://github.com/200-DevelopersFound/Havo/blob/main/apk/app.apk?raw=true)

[:star: Github Repository](https://github.com/200-DevelopersFound/Havo)

## Some Features

- Fully secured application via JWT Token
- Login from multiple mobile devices at the same time
- Convert your handwriting to speech and text via machine learning
- Save your daily conversation in the form of categories and dialogues

### Show some :heart: and :star: the repo to support the project.

## 👍 Contribution

1. Fork it
2. Create your feature branch (git checkout -b my-new-feature)
3. Commit your changes (git commit -m 'Add some feature')
4. Push to the branch (git push origin my-new-feature)
5. Create new Pull Request and rebase it with main

### What can you contribute

1. Add some more cool features.
2. Find bugs or errors and fix it.
3. Improve UI/UX designs.

# Code Overview

## Dependencies

- [expressjs](https://github.com/expressjs/express) - The server for handling and routing HTTP requests
- [mongoose](https://github.com/Automattic/mongoose) - For modeling and mapping MongoDB data to javascript
- [jsonwebtoken](https://github.com/auth0/node-jsonwebtoken) - For generating JWTs used by authentication
- [bcryptjs](https://www.npmjs.com/package/bcryptjs) - For hashing passwords
- [body-parser](https://www.npmjs.com/package/body-parser) - Node.js body parsing middleware
- [cors](https://www.npmjs.com/package/cors) - Node.js package for providing a Connect/Express middleware that can be used to enable CORS with various options
- [crypto-js](https://www.npmjs.com/package/crypto-js) - JavaScript library of crypto standards
- [custom-id-new](https://www.npmjs.com/package/custom-id-new) - For generating intuitive string in JavaScript
- [debug](https://www.npmjs.com/package/debug) - Javascript debugging utility modelled after Node.js core's debugging technique
- [dotenv](https://www.npmjs.com/package/dotenv) - For loading env variables
- [morgan](https://www.npmjs.com/package/morgan) - For logging HTTP request in node.js
- [nodemailer](https://www.npmjs.com/package/nodemailer) - For sending mails to user from server
- [otp-generator](https://www.npmjs.com/package/otp-generator) - For generating OTP for user verification
- [swagger-autogen](https://www.npmjs.com/package/swagger-autogen) - For documenting API
- [swagger-ui-express](https://www.npmjs.com/package/swagger-ui-express) - For documenting API

## Application Structure

- `app.js` - The entry point to our application. This file defines our express server and connects it to MongoDB using mongoose. It also requires the routes and models we'll be using in the application.
- `routes/` - This folder contains the route definitions for our API.
- `models/` - This folder contains the schema definitions for our Mongoose models.
- `middleware/` - This folder contains the middlewares for our application.
- `util/` - This folder contains the utility functions for our application.
- `configs/` - This folder contains the configs for database connectivity.

## Facing Any Problem or need any Help:grey_question:

Incase you face any problem or need any help write me in [issues](https://github.com/200-DevelopersFound/Havo-Backend/issues) section.
