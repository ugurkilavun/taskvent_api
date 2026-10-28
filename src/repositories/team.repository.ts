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

  public async findTeamByTeamID(teamIDs?: Array<string>): Promise<any> {
    return await team.find({ _id: teamIDs });
  };

  public async findTeamNameByTeamID(id: string): Promise<any> {
    return await team.findOne({ _id: id }, { _id: 1, title: 1 });
  };

  public async findOneTeamByID(id: string): Promise<any> {
    return await team.findOne({ _id: id });
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

  // Team and User ID
  public async findTeamByTUID(userID: string, teamID: string): Promise<any> {
    return await team.find({ _id: teamID, owner: userID, }, { _id: 1 });
  };

  public async UpdateTeam(id: string, title?: string, description?: string, projectManagers?: string, teamLeaders?: string, members?: string): Promise<any> {
    return await team.updateOne({
      _id: id
    }, {
      $set: {
        title: title,
        description: description,
      },
      $addToSet: {
        projectManagers: projectManagers,
        teamLeaders: teamLeaders,
        members: members,
      }

    });
  };

  public async removeUserFromTeam(userID: string, teamID: string): Promise<any> {
    return await team.updateOne({
      _id: teamID
    },
      {
        $pull: {
          projectManagers: userID,
          teamLeaders: userID,
          members: userID,
        }
      });
  };
};