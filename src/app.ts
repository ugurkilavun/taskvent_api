import express, { Application, NextFunction, Request, Response } from 'express';
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from 'dotenv';
// Configs
import connectDB from "./configs/db.config";
import { LogFile } from "./configs/log.config";
// Routes
import auth from "./routes/auth.route";
import verify from "./routes/verify.route";
import reset from "./routes/reset.route";
import project from "./routes/project.route";
// Middlewares
import { Logger } from "./middlewares/logger.middleware";

// .env config
dotenv.config({ quiet: true });

// Class
// Logger
const logger = new Logger(); // main
const logFile = new LogFile(); // main

// Creating directories and files
logFile.create();

// Database Connection
connectDB();

const app: Application = express();

// Logger middleware
app.use(logger.middleware);

app.use(bodyParser.json()); // To accept JSON data
app.use(cookieParser()); // Parse Cookie

// CORS
app.use(
  cors(
    {
      origin: "*", // Permitted URLs
      credentials: true // Access-Control-Allow-Credentials: true
    }
  )
);

// Router usage area
app.use('/', auth);
app.use('/', verify);
app.use('/', reset);
app.use('/', project);

// https://expressjs.com/en/guide/error-handling.html
// You define error-handling middleware last, after other app.use() and routes calls;
app.use((error: Error, req: Request, res: Response, next: NextFunction) => {
  logger.create(req, res, 0, { name: error.name, message: error.message, stack: error.stack });
  res.status(500).json({
    message: "Server error!",
  });
});

export default app;