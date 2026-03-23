import mongoose from 'mongoose';
// Configs
import appConfig from "./app.config";

const connectDB = (): void => {
  mongoose.connect(appConfig.databaseUrl)
    .then(() => console.log(`\x1b[32m[DEBUG] MongoDB Connected!\x1b[0m`))
    .catch(error => console.log(`\x1b[31m[DEBUG] MongoDB Not Connected!\x1b[0m`, error));
};

export default connectDB;