import express, { Express, Request, Response } from "express";
import connectDB from "./utils/db";
const dotenv = require("dotenv");

dotenv.config();
const app: Express = express();

const PORT = process.env.PORT || 3000;

connectDB();

app.get("/", (req: Request, res: Response) => {
  res.send("Hello World");
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
