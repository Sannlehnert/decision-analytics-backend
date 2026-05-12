import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

const opciones = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Decision Analytics Dashboard API',
      version: '1.0.0',
      description: 'API para registro, análisis y visualización de decisiones.',
    },
    servers: [{ url: 'http://localhost:3000/api' }],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
      schemas: {
        CrearDecision: {
          type: 'object',
          required: ['titulo', 'categoria'],
          properties: {
            titulo: { type: 'string', example: 'Cambiar de carrera' },
            descripcion: { type: 'string', nullable: true },
            categoria: { type: 'string', enum: ['trabajo', 'personal', 'salud', 'finanzas', 'educacion', 'otro'] },
            prioridad: { type: 'string', enum: ['baja', 'media', 'alta', 'urgente'], default: 'media' },
          },
        },
        ActualizarDecision: {
          type: 'object',
          properties: {
            titulo: { type: 'string' },
            descripcion: { type: 'string', nullable: true },
            categoria: { type: 'string', enum: ['trabajo', 'personal', 'salud', 'finanzas', 'educacion', 'otro'] },
            prioridad: { type: 'string', enum: ['baja', 'media', 'alta', 'urgente'] },
            estado: { type: 'string', enum: ['pendiente', 'en_seguimiento', 'cerrada', 'archivada'] },
          },
        },
      },
    },
    security: [{ bearerAuth: [] }],
  },
  apis: ['./src/rutas/*.js'],
};

const especificacion = swaggerJsdoc(opciones);

export const configurarSwagger = (app) => {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(especificacion));
};