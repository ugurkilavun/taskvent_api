// Models
import team from "../models/team.model";
// Types
import { teamType } from "../types/teams.type";

export const insertTeam = async (DATA: teamType): Promise<any> => {
  return await team.insertOne({
    title: DATA.title,
    description: DATA.description,
    owner: DATA.owner,
    projectManagers: DATA.projectManagers,
    teamLeaders: DATA.teamLeaders,
    members: DATA.members,
    createdAt: DATA.createdAt,
  });
};

// export const findTeamByTeamID = async (teamID: string): Promise<any> => {
//   return await team.findOne({
//     _id: teamID
//   });
// };

export const findTeamByTeamID = async (teamIDs: Array<string>): Promise<any> => {
  return await team.find({ _id: teamIDs });
};

export const findTeamByUserID = async (projectID: string, userID: string): Promise<any> => {
  return await team.findOne({
    projectID: projectID,
    userID: userID
  });
};

export const findTeamIDByUserID = async (userID: string): Promise<any> => {
  return await team.find({ $or: [{ members: { $in: userID } }, { teamLeaders: { $in: userID } }, { projectManagers: { $in: userID } }] }, { _id: 1 });
};