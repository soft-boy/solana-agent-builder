import swaggerJsdoc from 'swagger-jsdoc';
import path from 'path';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Hello World',
      version: '1.0.0',
    },
    servers: [
      {
        url: process.env.BASE_URL || 'http://localhost:8888',
      },
    ],
  },
  apis: [path.join(__dirname, '*.mjs')], // files containing annotations as above
};

const swagger = async () => {
  const openapiSpecification = swaggerJsdoc(options);

  return new Response(
    JSON.stringify(openapiSpecification),
    { status: 200, headers: { "Content-Type": "application/json" },
  });
}

export default swagger;