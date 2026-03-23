import app from "./app";
import http from "http";
// Configs
import appConfig from "./configs/app.config";

const server = http.createServer(app);

server.listen(appConfig.port, () => {
  console.log(`\x1b[32m[DEBUG] Server running on port ${appConfig.port}!\x1b[0m`)
});