import express, { Router } from 'express';
import dotenv from 'dotenv';
// Controllers
import { createProjectController, getProjectController, getProjectsController, patchProjectsController } from "../controllers/project.controller"; // Projects
// import { createTaskController, getTaskController } from "../controllers/task.controller"; // Tasks
// Middlewares
import { AuthMiddleware } from "../middlewares/auth.middleware";

// Class
const authMiddleware = new AuthMiddleware();

// .env config
dotenv.config({ quiet: true });

const router: Router = express.Router();

// Projects
router.post('/projects', authMiddleware.checkToken, createProjectController);
router.get('/projects', authMiddleware.checkToken, getProjectsController); // Multi
router.get('/projects/:projectID', authMiddleware.checkToken, getProjectController); // Single
router.patch('/projects/:projectID', authMiddleware.checkToken, patchProjectsController); // Single
// * router.delete('/projects/:projectID', authControl, getProjectController); // Single
// router.patch('/projects', authControl, projectController);
// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
// router.patch('/projects/:projectid', authControl, addTeamController);
// ? ------------------------------------------------------------------------
// POST /projects/:projectId/teams - Project’e team ekleme
// GET /projects/:projectId/teams - Project içindeki tüm team’leri listeleme
// GET /projects/:projectId/teams/:teamId - Tek bir team’i getirme
// PATCH /projects/:projectId/teams/:teamId - Team güncelleme (kısmi)
// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
// Tasks
// router.post('/projects/:projectid/task', authControl, createTaskController);
// router.get('/projects/:projectid/task/:taskid', authControl, getTaskController);
// Teams
// router.post('/team', authControl, createTeamController);
// router.get('/team/:teamid', authControl, getTeamController);

export default router;