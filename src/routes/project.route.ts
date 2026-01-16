import express, { Router } from 'express';
import dotenv from 'dotenv';
// Controllers
import { createProjectController, getProjectController, getProjectsController } from "../controllers/project.controller"; // Projects
// import { createTaskController, getTaskController } from "../controllers/task.controller"; // Tasks
// Middlewares
import { authControl } from "../middlewares/auth.middleware";

// .env config
dotenv.config({ quiet: true });

const router: Router = express.Router();

// Projects
router.post('/projects', authControl, createProjectController);
router.get('/projects', authControl, getProjectsController); // Multi
router.get('/projects/:projectID', authControl, getProjectController); // Single
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