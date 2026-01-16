// Models
import project from "../models/project.model";
// Types
import { projectType } from "../types/projects.type";

export const insertProject = async (DATA: projectType): Promise<any> => {
  return await project.insertOne({
    owner: DATA.owner,
    teamID: DATA.teamID,
    title: DATA.title,
    description: DATA.description,
    tags: DATA.tags,
    createdAt: DATA.createdAt
  });
};

export const findOneProject = async (projectID: string): Promise<any> => {
  return await project.findOne({
    _id: projectID,
  });
};

export const findProjectsByUserID = async (userID: string): Promise<any> => {
  return await project.find({
    owner: userID,
  });
};

export const findProjectsByTeamID = async (teamID: string): Promise<any> => {
  return await project.find({
    teamID: { $in: teamID }
  });
};

export const findProjectsByTeamIDTest = async (teamIDs: Array<string>): Promise<any> => {
  return await project.find({
    teamID: { $in: teamIDs }
  });
};