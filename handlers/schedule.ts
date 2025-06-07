import type { Request, Response } from "express";

const schedule = async (req: Request, res: Response) => {
  res.send("Schedule list");
};

export default schedule;
