const swaggerAuto = require('swagger-autogen')();

const doc = {
  info: {
    title: "Library API",
    description: "An API for managing a library system",
  },
  host: "wdd341-finalproject.onrender.com",
  schemes: ["https"],
};

const outputFile = './swagger.json';
const routes = ['./routes/bookRoutes.js', './routes/userRoutes.js', './routes/reviewRoutes.js', './routes/borrowRoutes.js'];

swaggerAuto(outputFile, routes, doc)
    .then(() => {
        console.log('Swagger documentation generated successfully');
    })
    .catch((error) => {
        console.error('Error generating Swagger documentation:', error);
    });