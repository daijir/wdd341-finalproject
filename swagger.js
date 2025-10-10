const swaggerAuto = require('swagger-autogen')();

const doc = {
    info: {
        title: 'Library API',
        description: 'An API for managing a library system',
    },
    host: 'localhost:3000', 
    //host: 'didactic-engine-94x7q5wq9jr2x75q-3000.app.github.dev',
    //schemes: ['https'],
    schemes: ['http'],
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