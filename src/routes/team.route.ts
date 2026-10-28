import express, { Router } from 'express';
import dotenv from 'dotenv';
// Controllers
import { createTeamController, patchTeamController } from "../controllers/team.controller"; // Teams
// Middlewares
import { AuthMiddleware } from "../middlewares/auth.middleware";

// Class
const authMiddleware = new AuthMiddleware();

// .env config
dotenv.config({ quiet: true });

const router: Router = express.Router();

// Teams
router.post('/teams', authMiddleware.middleware, createTeamController);
router.patch('/team/:teamID', authMiddleware.middleware, patchTeamController);

export default router;