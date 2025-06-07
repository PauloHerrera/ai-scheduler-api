import express from "express";
import apiRoute from "./routes/apiRoute";

const app = express();

const port = process.env.APP_PORT || 3000;

app.use("/api", apiRoute);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
