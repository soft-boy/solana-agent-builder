import { NextApiRequest, NextApiResponse } from 'next';
import swaggerUi from 'swagger-ui-express';
import swaggerSpec from '../../swagger'; // Adjust the path as needed

export const config = {
  api: {
    bodyParser: false, // Disable body parsing for Swagger UI
  },
};

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const swaggerHandler = swaggerUi.setup(swaggerSpec);
  return swaggerUi.serve(req, res, () => swaggerHandler(req, res));
}