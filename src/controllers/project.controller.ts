import { Request, Response } from 'express';
// Services
import { createProject, getProject, getProjects } from "../services/project.service";
// import { createTask } from "../services/task.service";
// Utils
import { ProjectExceptionHandler } from '../utils/customErrorHandlers.util';
import { StreamState } from 'node:http2';

// Class
const ProjectExceptionHandlerTemp = new ProjectExceptionHandler();

export const createProjectController = async (req: Request, res: Response) => {

  // Datas
  const { userID, teamID, title, description, tags }: {
    userID: string, teamID: Array<string>, title: string, description: string, tags: Array<string>,
  } = req.body;

  await ProjectExceptionHandlerTemp.Handle(
    { file: "projects", level: "RESPONSE", logType: "project", service: "project.service" },
    req,
    res,
    () => createProject(userID, teamID, title, description, tags)
  );
};

export const getProjectController = async (req: Request, res: Response) => {

  // Datas
  const userID: any = req.params.userID; // Error: 'string | string[]'
  const projectID: any = req.params.projectID; // Error: 'string | string[]'

  await ProjectExceptionHandlerTemp.Handle(
    { file: "projects", level: "RESPONSE", logType: "project", service: "project.service" },
    req,
    res,
    () => getProject(userID, projectID)
  );
};

export const getProjectsController = async (req: Request, res: Response) => {

  // Datas
  const userID: any = req.params.userID; // Error: 'string | string[]'

  await ProjectExceptionHandlerTemp.Handle(
    { file: "projects", level: "RESPONSE", logType: "project", service: "project.service" },
    req,
    res,
    () => getProjects(userID)
  );
};