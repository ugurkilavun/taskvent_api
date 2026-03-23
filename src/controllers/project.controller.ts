import { Request, Response } from 'express';
// Services
import { createProject, getProject, getProjects, patchProject } from "../services/project.service";
// import { createTask } from "../services/task.service";
// Utils
import catchAsync from "../utils/catchAsync.util";
import { HttpResponse } from '../utils/response.util';
// Types
import { defaultResponseType } from "../types/responses.type";

// Class
const httpResponse = new HttpResponse();

// * POST /projects
export const createProjectController = catchAsync(async (req: Request, res: Response): Promise<void> => {
  // Datas
  const { teamID, title, description, tags }: { teamID: Array<string>, title: string, description: string, tags: Array<string> } = req.body;
  const { id }: { id: string } = res.locals.user;

  const { message, statusCode }: defaultResponseType = await createProject(id, teamID, title, description, tags);

  httpResponse.default(res, message, statusCode,);
});

// * GET /projects
export const getProjectsController = catchAsync(async (req: Request, res: Response): Promise<void> => {

  // Datas
  const { id }: { id: string } = res.locals.user;

  const { statusCode, message, data }: defaultResponseType = await getProjects(id);

  httpResponse.default(res, message, statusCode, data);
});

// * GET /projects/:projectID
export const getProjectController = catchAsync(async (req: Request, res: Response): Promise<void> => {

  // Datas
  const { id }: { id: string } = res.locals.user;
  const projectID: string = req.params.projectID as string;

  const { message, statusCode, data }: defaultResponseType = await getProject(id, projectID);

  httpResponse.default(res, message, statusCode, data);
});

// * PATCH /projects/:projectID
export const patchProjectsController = catchAsync(async (req: Request, res: Response): Promise<void> => {

  // Datas
  const { id }: { id: string } = res.locals.user;
  const projectID: string = req.params.projectID as string;
  const { teamID, title, description, tags }: { teamID?: Array<string>, title?: string, description?: string, tags?: Array<string> } = req.body;

  const { message, statusCode, data }: defaultResponseType = await patchProject(id, projectID, teamID, title, description, tags);

  httpResponse.default(res, message, statusCode, data);
});