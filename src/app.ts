import express, { Application, Request, Response } from 'express';
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from 'dotenv';
// Configs
import connectDB from "./configs/db.config";
import { createFiles } from "./configs/createFiles.config";
// Routes
// import login from "./routes/login.route";
// import register from "./routes/register.route";
import auth from "./routes/auth.route";
import verify from "./routes/verify.route";
import reset from "./routes/reset.route";
// import refresh from "./routes/refresh.route";
import project from "./routes/project.route";
// Middlewares
import { Logger } from "./middlewares/logger.middleware";

// .env config
dotenv.config({ quiet: true });

// Logger
const logger = new Logger();

// Creating directories and files
createFiles();

// Database Connection
connectDB();

const app: Application = express();

app.use(bodyParser.json()); // To accept JSON data
app.use(cookieParser()); // Parse Cookie

// CORS
app.use(
  cors(
    {
      origin: "*", // Permitted URLs
      credentials: true // Access-Control-Allow-Credentials: true
    }
  ));

// Router usage area
app.use('/', auth);
// app.use('/', register);
app.use('/', verify);
app.use('/', reset);
// app.use('/', refresh);
app.use('/', project);

// https://expressjs.com/en/guide/error-handling.html
app.use((error: Error, req: Request, res: Response, next: any) => {
  logger.create({
    timestamp: new Date(),
    level: "RESPONSE",
    logType: "server",
    message: error.message,
    service: "app",
    ip: req.ip,
    endpoint: req.url,
    method: req.method,
    userAgent: req.get('user-agent'),
    statusCode: 500,
    details: {
      error: "ANYERROR",
      stack: `Error: ${error.stack}`
    }
  }, { file: "server", seeLogConsole: true });
  res.status(500).send({ message: "Something broke!" });
})

export default app;