import { Request, Response } from 'express';
// Services
import { createTeam, patchTeam } from "../services/team.service";
// Utils
import catchAsync from "../utils/catchAsync.util";
import { HttpResponse } from '../utils/response.util';
// Types
import { defaultResponseType } from "../types/responses.type";

// Class
const httpResponse = new HttpResponse();

// * POST /teams
export const createTeamController = catchAsync(async (req: Request, res: Response): Promise<void> => {
  // Datas
  const { title, description, projectManagers, teamLeaders, members }:
    { title: string, description: string, projectManagers?: Array<string>, teamLeaders?: Array<string>, members?: Array<string> } = req.body;
  const { id }: { id: string } = res.locals.user;

  const { message, statusCode }: defaultResponseType = await createTeam(id, title, description, projectManagers, teamLeaders, members);

  httpResponse.default(res, message, statusCode,);
});

// * PATCH /teams/:teamID
export const patchTeamController = catchAsync(async (req: Request, res: Response): Promise<void> => {
  // Datas
  const { title, description, projectManagers, teamLeaders, members }:
    { title?: string, description?: string, projectManagers?: Array<string>, teamLeaders?: Array<string>, members?: Array<string> } = req.body;
  const teamID: string = req.params.teamID as string;
  const { id }: { id: string } = res.locals.user;

  const { message, statusCode }: defaultResponseType = await patchTeam(id, teamID, title, description, projectManagers, teamLeaders, members);

  httpResponse.default(res, message, statusCode,);
});