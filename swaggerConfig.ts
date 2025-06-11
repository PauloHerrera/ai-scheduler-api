import swaggerJsdoc from 'swagger-jsdoc';
// No need to import fs or js-yaml if swagger-jsdoc handles YAML loading directly from 'apis' array.

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'AI Scheduler API',
      version: '1.0.0',
      description: 'API documentation for the AI Scheduler application, including Doctor management.',
    },
    servers: [
      {
        url: `http://localhost:${process.env.APP_PORT || 3000}/api`,
        description: 'Development server',
      },
    ],
    // components.schemas are now loaded from YAML files specified in 'apis'
  },
  // apis: ['./routes/*.ts', './handlers/*.ts', './schemas/*.ts'], // Old configuration
  apis: [
    './docs/swagger/paths/*.yaml',
    './docs/swagger/components/*.yaml'
  ], // Updated to point to YAML files
};

export const swaggerSpec = swaggerJsdoc(options);
