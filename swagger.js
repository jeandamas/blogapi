const swaggerUI = require("swagger-ui-express");
const swaggerJsDoc = require("swagger-jsdoc");

// SWAGGER DOCUMENTATION
const options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "Blog API",
            description: "CRUD API for personal Website",
            version: "1.0.0",
        },
        servers: [{ url: "http://localhost:5050" }],
    },
    // looks for configuration in specified directories
    apis: ["./routes/*.js"],
};
