import express from "express";
import apiRoute from "./routes/apiRoute";
import doctorRoutes from "./routes/doctorRoutes"; // Import doctor routes

const app = express();

const port = process.env.APP_PORT || 3000;

app.use(express.json()); // Add middleware to parse JSON bodies

app.use("/api", apiRoute);
app.use("/api/doctors", doctorRoutes); // Mount doctor routes

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
