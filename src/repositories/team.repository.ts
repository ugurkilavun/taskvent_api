// Models
import team from "../models/team.model";
// Types
import { teamType } from "../types/teams.type";

export class TeamRepository {

  public async insertTeam(DATA: teamType): Promise<any> {
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

  public async findTeamByTeamID(teamIDs: Array<string>): Promise<any> {
    return await team.find({ _id: teamIDs });
  };

  public async findTeamByUserID(projectID: string, userID: string): Promise<any> {
    return await team.findOne({
      projectID: projectID,
      userID: userID
    });
  };

  public async findTeamIDByUserID(userID: string): Promise<any> {
    return await team.find({ $or: [{ members: { $in: userID } }, { teamLeaders: { $in: userID } }, { projectManagers: { $in: userID } }] }, { _id: 1 });
  };

};