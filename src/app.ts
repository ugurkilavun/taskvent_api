import express, { Application } from 'express';
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import cors from "cors";
// Configs
import connectDB from "./configs/db.config";
import { LogFile } from "./configs/log.config";
// Routes
import auth from "./routes/auth.route";
import project from "./routes/project.route";
// Middlewares
import { Logger } from "./middlewares/logger.middleware";
import { errorHandler } from "./middlewares/error.middleware";

// Class
const logger = new Logger(); // Logger
const logFile = new LogFile(); // Log file creation

// Creating directories and files
logFile.create();

// Database Connection
connectDB();

const app: Application = express();

// Middlewares
app.use(bodyParser.json()); // To accept JSON data
app.use(cookieParser()); // Parse Cookie
app.use(logger.middleware); // HTTP request log

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
app.use('/', project);

// https://expressjs.com/en/guide/error-handling.html
app.use(errorHandler);

export default app;