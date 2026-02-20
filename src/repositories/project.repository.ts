// Models
import project from "../models/project.model";
// Types
import { projectType } from "../types/projects.type";

export class ProjectRepository {

  public async insertProject(DATA: projectType): Promise<any> {
    return await project.insertOne({
      owner: DATA.owner,
      teamID: DATA.teamID,
      title: DATA.title,
      description: DATA.description,
      tags: DATA.tags,
      createdAt: DATA.createdAt
    });
  };

  public async findOneProject(projectID: string): Promise<any> {
    return await project.findOne({
      _id: projectID,
    });
  };

  public async findProjectsByUserID(userID: string): Promise<any> {
    return await project.find({
      owner: userID,
    });
  };


  public async findProjectsByTeamID(teamIDs: Array<string>): Promise<any> {
    return await project.find({
      teamID: { $in: teamIDs }
    });
  };


  public async updateProjectsByProjectID(projectID: string, teamID?: Array<string>, title?: string, description?: string, tags?: Array<string>): Promise<any> {
    return await project.updateOne({
      _id: projectID
    }, {
      $set: {
        teamID: teamID,
        title: title,
        description: description,
        tags: tags
      }
    });
  };

};