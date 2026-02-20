import express, { Router } from 'express';
import dotenv from 'dotenv';
// Controllers
// Login
import { loginWebController, loginMobileController } from "../controllers/login.controller";
// Register
import { registerWebController, registerMobileController } from "../controllers/register.controller";
// Refresh
import { refreshWebController, refreshMobileController } from "../controllers/refresh.controller";

// .env config
dotenv.config({ quiet: true })

const router: Router = express.Router();

// Login Route
router.post('/auth/web/login', loginWebController);
router.post('/auth/mobile/login', loginMobileController);
// Register Route
router.post('/auth/web/register', registerWebController);
router.post('/auth/mobile/register', registerMobileController);
// Refresh Route
router.post('/auth/web/refresh', refreshWebController);
router.post('/auth/mobile/refresh', refreshMobileController);

export default router;