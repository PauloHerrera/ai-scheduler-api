import swaggerJsdoc from 'swagger-jsdoc';

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
    components: {
     schemas: {
       Doctor: {
         type: 'object',
         required: ['name', 'registration', 'expertise', 'appointmentType', 'appointmentPrice'],
         properties: {
           id: {
             type: 'string',
             format: 'uuid',
             description: 'The auto-generated ID of the doctor.',
             readOnly: true,
           },
           name: {
             type: 'string',
             description: "Doctor's full name.",
           },
           registration: {
             type: 'string',
             description: "Doctor's medical registration number (e.g., CRM). Must be unique.",
           },
           expertise: {
             type: 'string',
             description: "Doctor's medical specialty or expertise.",
           },
           appointmentType: {
             type: 'array',
             items: {
               type: 'string',
             },
             description: 'Types of appointments the doctor offers (e.g., PRIVATE, HEALTH_PLAN).',
           },
           appointmentPrice: {
             type: 'number',
             format: 'float',
             description: 'Price for a private consultation.',
           },
           createdAt: {
             type: 'string',
             format: 'date-time',
             description: 'Timestamp of when the doctor was created.',
             readOnly: true,
           },
           updatedAt: {
             type: 'string',
             format: 'date-time',
             description: 'Timestamp of when the doctor was last updated.',
             readOnly: true,
           },
         },
         example: {
           id: 'd290f1ee-6c54-4b01-90e6-d701748f0851',
           name: 'Dr. John Doe',
           registration: 'CRM12345',
           expertise: 'Cardiology',
           appointmentType: ['PRIVATE', 'HEALTH_PLAN'],
           appointmentPrice: 250.75,
           createdAt: '2023-10-07T10:00:00.000Z',
           updatedAt: '2023-10-07T12:30:00.000Z',
         },
       },
       DoctorInput: {
         type: 'object',
         required: ['name', 'registration', 'expertise', 'appointmentType', 'appointmentPrice'],
         properties: {
           name: {
             type: 'string',
             description: "Doctor's full name.",
             example: 'Dr. Jane Doe',
           },
           registration: {
             type: 'string',
             description: "Doctor's medical registration number. Must be unique.",
             example: 'CRM54321',
           },
           expertise: {
             type: 'string',
             description: "Doctor's medical specialty.",
             example: 'Pediatrics',
           },
           appointmentType: {
             type: 'array',
             items: {
               type: 'string',
             },
             description: 'Types of appointments offered.',
             example: ['PRIVATE'],
           },
           appointmentPrice: {
             type: 'number',
             format: 'float',
             description: 'Price for a private consultation.',
             example: 180.00,
           },
         },
       },
       ErrorResponse: {
         type: 'object',
         properties: {
           message: { type: 'string' },
           errors: { type: 'object' }
         }
       }
     }
    }
  },
  apis: ['./routes/*.ts', './handlers/*.ts', './schemas/*.ts'], // Paths to files containing OpenAPI definitions
};

export const swaggerSpec = swaggerJsdoc(options);
