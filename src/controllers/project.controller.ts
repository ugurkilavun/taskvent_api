import { Request, Response } from 'express';
// Services
import { createProject, getProject, getProjects, patchProject } from "../services/project.service";
// import { createTask } from "../services/task.service";
// Utils
import { ExceptionHandlers } from '../utils/customExceptionHandlers';

// Class
const exceptionHandlers = new ExceptionHandlers();

export const createProjectController = async (req: Request, res: Response) => {

  // Datas
  const { teamID, title, description, tags }: { teamID: Array<string>, title: string, description: string, tags: Array<string> } = req.body;
  const { id }: { id: string } = res.locals.user;

  await exceptionHandlers.responseHandler(
    { file: "projects", level: "RESPONSE", logType: "project", service: "project.service: createProject" },
    "project",
    req,
    res,
    () => createProject(id, teamID, title, description, tags)
  );
};

export const getProjectsController = async (req: Request, res: Response) => {

  // Datas
  const { id }: { id: string } = res.locals.user;

  await exceptionHandlers.responseHandler(
    { file: "projects", level: "RESPONSE", logType: "project", service: "project.service: getProjects" },
    "project",
    req,
    res,
    () => getProjects(id)
  );
};

export const getProjectController = async (req: Request, res: Response) => {

  // Datas
  const { id }: { id: string } = res.locals.user;
  const projectID: any = req.params.projectID; // ! Error: 'string | string[]'

  await exceptionHandlers.responseHandler(
    { file: "projects", level: "RESPONSE", logType: "project", service: "project.service: getProject" },
    "project",
    req,
    res,
    () => getProject(id, projectID)
  );
};

export const patchProjectsController = async (req: Request, res: Response) => {

  // Datas
  const { id }: { id: string } = res.locals.user;
  const projectID: any = req.params.projectID; // ! Error: 'string | string[]'
  const { teamID, title, description, tags }: { teamID?: Array<string>, title?: string, description?: string, tags?: Array<string> } = req.body;

  await exceptionHandlers.responseHandler(
    { file: "projects", level: "RESPONSE", logType: "project", service: "project.service: patchProject" },
    "project",
    req,
    res,
    () => patchProject(id, projectID, teamID, title, description, tags)
  );
};