// Models
import team from "../models/team.model";
import invitation from "../models/invitation.model";
import project from "../models/project.model";
// Types
import { invitationType } from "../types/invitation.type";
import { projectType } from "../types/projects.type";

export class InvitationRepository {

  public async instertInvProject(DATA: invitationType): Promise<any> {
    return await invitation.insertOne({
      token: DATA.token,
      type: DATA.type,
      status: DATA.status,
      invitedBy: DATA.invitedBy,
      userId: DATA.userId,
      mainResourceId: DATA.mainResourceId,
      secondarySourceId: DATA.secondarySourceId,
      expiresAt: DATA.expiresAt,
      createdAt: DATA.createdAt,
    });
  };

  public async instertInvTeam(DATA: invitationType): Promise<any> {
    return await invitation.insertOne({
      token: DATA.token,
      type: DATA.type,
      status: DATA.status,
      invitedBy: DATA.invitedBy,
      userId: DATA.userId,
      mainResourceId: DATA.mainResourceId,
      secondarySourceId: DATA.secondarySourceId,
      role: DATA.role,
      expiresAt: DATA.expiresAt,
      createdAt: DATA.createdAt,
    });
  };

  public async updateByTokenInvStatus(token: string, status: "pending" | "accepted" | "rejected" | "expired"): Promise<any> {
    return await invitation.updateOne({
      token: token,
    }, { $set: { status: status } });
  };

  public async findInvByToken(token: string): Promise<any> {
    return await invitation.findOne({ token: token });
  };

  public async findSameInvForProject(userId: string, mainResourceId: string, secondarySourceId: string): Promise<any> {
    return await invitation.findOne(
      {
        userId: userId,
        mainResourceId: mainResourceId,
        secondarySourceId: secondarySourceId
      }
    );
  };

  public async findSameInvForTeam(invitedID: string, mainResourceId: string, secondarySourceId: string, role: string): Promise<any> {
    return await invitation.findOne(
      {
        invitedBy: invitedID,
        mainResourceId: mainResourceId,
        secondarySourceId: secondarySourceId,
        role: role
      }
    );
  };

  public async updateProjectsTeam(projectID: string, teamID: string): Promise<any> {
    return await project.updateOne({ _id: projectID },
      {
        $addToSet: {
          teamID: teamID
        }
      });
  };

  public async findRoleByTeamID(teamID: string, role: string): Promise<any> {
    return await team.findOne(
      {
        _id: teamID
      },
      {
        _id: 1,
        [role]: 1
      }
    );
  };

};