import express from "express";
import schedule from "../handlers/schedule";

const router = express.Router();

router.get("/schedule", (req, res) => {
  schedule(req, res);
});

export default router;
