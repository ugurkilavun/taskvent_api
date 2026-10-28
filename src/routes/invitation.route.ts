import express, { Router } from 'express';
// Middlewares
// import { AuthMiddleware } from "../middlewares/auth.middleware";
// Controllers
import { acceptInvitationController, rejectInvitationController } from "../controllers/invitation.controller";

const router: Router = express.Router();

// Availability Route
router.get('/invitation/accept/:token', acceptInvitationController);
router.get('/invitation/reject/:token', rejectInvitationController);

export default router;