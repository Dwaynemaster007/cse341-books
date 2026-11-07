import express from 'express';
import swaggerUi from 'swagger-ui-express';
import swaggerDocument from './swagger.json' with { type: 'json' };
import router from './src/router.js';

const app = express();

app.use(express.json());
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use(router);

/**
 * @openapi
 * /:
 *   get:
 *     summary: Check that the server is running
 *     tags:
 *       - Health
 *     responses:
 *       200:
 *         description: Server is running
 *         content:
 *           application/json:
 *             example:
 *               message: Server is running
 */
app.get('/', (req, res) => {
  return res.status(200).json({ message: 'Server is running' });
});

export default app;
