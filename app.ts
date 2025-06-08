import express from "express";
import apiRoute from "./routes/apiRoute";
import doctorRoutes from "./routes/doctorRoutes";
import swaggerUi from 'swagger-ui-express'; // Added
import { swaggerSpec } from './swaggerConfig'; // Added

const app = express();

const port = process.env.APP_PORT || 3000;

app.use(express.json());

// Serve Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec)); // Added

app.use("/api", apiRoute);
app.use("/api/doctors", doctorRoutes);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
  console.log(`API documentation available at http://localhost:${port}/api-docs`); // Added
});
