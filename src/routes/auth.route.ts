import express, { Router } from 'express';
// Middlewares
import { AuthMiddleware } from "../middlewares/auth.middleware";
// Controllers
// Availability
import { usernameAvailabilityController, emailAvailabilityController } from "../controllers/availability.controller";
// Login
import { loginWebController, loginMobileController } from "../controllers/login.controller";
// Register
import { registerWebController, registerMobileController } from "../controllers/register.controller";
// Refresh
import { refreshController } from "../controllers/refresh.controller";
// Refresh
import { logoutController } from "../controllers/logout.controller";
// Verify
import verifyController from "../controllers/verify.controller";
// Reset(s): Forgot password & Reset password
import { forgotPasswordController, resetPasswordController } from "../controllers/reset.controller";

const router: Router = express.Router();

// Class
const authMiddleware = new AuthMiddleware();

// Availability Route
router.get('/auth/username-availability/:username', usernameAvailabilityController);
router.get('/auth/email-availability/:email', emailAvailabilityController);
// Login Route
router.post('/auth/web/login', loginWebController);
router.post('/auth/mobile/login', loginMobileController);
// Register Route
router.post('/auth/web/register', registerWebController);
router.post('/auth/mobile/register', registerMobileController);
// Refresh Route
router.post('/auth/refresh', refreshController);
// Logout Route
router.post('/auth/logout', authMiddleware.middleware, logoutController);
// Verify Route
router.get('/auth/verify/:token', verifyController);
// Reset(s) Route: Forgot password & Reset password
router.post('/auth/forgot-password', forgotPasswordController);
router.post('/auth/reset-password/:token', resetPasswordController);

export default router;