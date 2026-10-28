// // .env
// import dotenv from 'dotenv';
// // Middlewares
// import { Logger } from "../middlewares/logger.middleware";

// dotenv.config({ quiet: true })

// describe("Logger", () => {

//   it("Logger tests.", async () => {
//     const logger = new Logger();

//     // Logger - RESPONSE
//     logger.create({
//       timestamp: new Date(),
//       level: "INFO",
//       logType: "test",
//       message: "Test message!",
//       service: "tests",
//       userID: "7saims717g17615fgs1",
//       username: "testtest",
//       token: `72b2761v15r1vu271g2`,
//       ip: "127.0.0.1",
//       endpoint: "/none",
//       method: "test",
//       userAgent: "user-agent",
//       statusCode: 777,
//       durationMs: 10.02827292726538,
//       details: {
//         error: "STATCODEERROR",
//         stack: `Error: test error`
//       }
//     }, { file: "tests", seeLogConsole: true });
//   });
// });