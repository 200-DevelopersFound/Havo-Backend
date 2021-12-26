const swaggerAutogen = require("swagger-autogen")();

const outputFile = "./swagger_output.json";
const endpointsFiles = ["./app.js"];

const doc = {
  info: {
    version: "3.0.0",
    title: "Handwriter Express Application",
    description: "Handwriter Express Application Routes",
  },
  host: "handwritingbackend.herokuapp.com",
  basePath: "/",
  schemes: ["http", "https"],
  consumes: ["application/json"],
  produces: ["application/json"],
  tags: [
    {
      name: "API Docs",
      description: "API documentation",
    },
    {
      name: "Email",
      description: "Trigger OTP and verify Email Address",
    },
    {
      name: "User",
      description: "Sign Up , Login and Logout users",
    },
    {
      name: "User Category",
      description: "User`s categories and dialogue",
    },
    {
      name: "Login Activity",
      description: "Login Activity routes",
    },
  ],
  securityDefinitions: {
    api_key: {
      type: "apiKey",
      name: "authorization",
      in: "header",
    },
  },
  definitions: {
    BlacklistToken: {
      token:
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYxYmY3N2M4MTcwMWYwM2QxMGZkOTBlYyIsInRva2VuX2lkIjoiMzkwMk9HRUwwOTEzREFESiIsImlhdCI6MTYzOTkzNzk5Mn0.noLtLpwevdnkhFU9uOKepT2Ynd-rjnRCCeLA3yd323g",
      createdAt: "1640285891286",
      updatedAt: "1640285891286",
    },
    OTP: {
      createdAt: "1640286062295",
      expirationTime: "1640286062295",
      otp: "XXXXXX",
      verified: true,
    },
    User: {
      username: "Shreyans13",
      email: "shreyans13xxxx@gmail.com",
      password: "xxxxxxxxxxxxxxxxx",
      token:
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYxYmY3N2M4MTcwMWYwM2QxMGZkOTBlYyIsInRva2VuX2lkIjoiMzkwMk9HRUwwOTEzREFESiIsImlhdCI6MTYzOTkzNzk5Mn0.noLtLpwevdnkhFU9uOKepT2Ynd-rjnRCCeLA3yd323g",
      resetPasswordToken:
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYxYmY3N2M4MTcwMWYwM2QxMGZkOTBlYyIsInRva2VuX2lkIjoiMzkwMk9HRUwwOTEzREFESiIsImlhdCI6MTYzOTkzNzk5Mn0.noLtLpwevdnkhFU9uOKepT2Ynd-rjnRCCeLA3yd323g",
      resetPasswordExpiry:
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYxYmY3N2M4MTcwMWYwM2QxMGZkOTBlYyIsInRva2VuX2lkIjoiMzkwMk9HRUwwOTEzREFESiIsImlhdCI6MTYzOTkzNzk5Mn0.noLtLpwevdnkhFU9uOKepT2Ynd-rjnRCCeLA3yd323g",
    },

    UserLogin: {
      userId: "61bcd94c9975fe02148587b1",
      loggedOut: false,
      loggedInAt: "1639766269396",
      loggedOutAt: "1639766269396",
      ipAddress: "::1",
      tokenId: "8778YZFX5888JYJL",
      tokenSecret: "22449244HBUBSKAF22929924JYKKLORN",
      tokenDeleted: true,
      device: "PostmanRuntime/7.28.4",
    },
  },
};

// const controlSwagger = async () => {
swaggerAutogen(outputFile, endpointsFiles, doc);
// };
// module.exports = controlSwagger;
