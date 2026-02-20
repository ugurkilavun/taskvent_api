import express, { Router } from 'express';
import dotenv from 'dotenv';
// Controllers
import { forgotPasswordController, resetPasswordController } from "../controllers/reset.controller";

// .env config
dotenv.config({ quiet: true })

const router: Router = express.Router();

// Reset Route
router.post('/forgotPassword', forgotPasswordController);
router.post('/resetPassword/:token', resetPasswordController);

export default router;