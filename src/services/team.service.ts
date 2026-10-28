// Services
import { sendTeamInvitation } from "./invitations/team-invitation.service";
// Utils
import { statusCodeErrors, } from "../utils/customErrors.util";
// Repositories
import { ProjectRepository } from "../repositories/project.repository";
import { TeamRepository } from "../repositories/team.repository";
import { TaskRepository } from "../repositories/task.repository";
import { UserRepository } from "../repositories/user.repository";
// Types
// import { projectsType, taskMemberType, tasksType, teamsType } from "../types/team.type";
import { defaultResponseType } from "../types/responses.type";
import { roles } from "../types/roles.type";

// Class
const projectRepository = new ProjectRepository();
const teamRepository = new TeamRepository();
const taskRepository = new TaskRepository();
const userRepository = new UserRepository();

// Private Funtions

const filterTeams = async (userID: string, projectManagers?: Array<string>, teamLeaders?: Array<string>, members?: Array<string>): Promise<{
  updatedProjectManagers: object[] | undefined;
  updatedTeamLeaders: object[] | undefined;
  updatedMembers: object[] | undefined;
}> => {

  // Uniques
  const uniqueProjectManagers: Array<string> = [...new Set(projectManagers)];
  const uniqueTeamLeaders: Array<string> = [...new Set(teamLeaders)];
  const uniqueMembers: Array<string> = [...new Set(members)];

  let fiEverythingByIdPMDATA: any = [];
  let fiEverythingByIdTMDATA: any = [];
  let fiEverythingByIdMDATA: any = [];

  if (projectManagers?.length) {
    fiEverythingByIdPMDATA = await userRepository.findFLUECByID(uniqueProjectManagers);
    if (fiEverythingByIdPMDATA.length !== uniqueProjectManagers.length) throw new statusCodeErrors("User not found.", 404);
  };

  if (teamLeaders?.length) {
    fiEverythingByIdTMDATA = await userRepository.findFLUECByID(teamLeaders);
    if (fiEverythingByIdTMDATA.length !== uniqueTeamLeaders.length) throw new statusCodeErrors("User not found.", 404);
  };

  if (members?.length) {
    fiEverythingByIdMDATA = await userRepository.findFLUECByID(members);
    if (fiEverythingByIdMDATA.length !== uniqueMembers.length) throw new statusCodeErrors("User not found.", 404);
  };

  // Remove the user's own ID to prevent them from changing their own role.
  const updatedProjectManagers = fiEverythingByIdPMDATA.filter((user: any) => (user._id).toString() !== userID);
  const updatedTeamLeaders = fiEverythingByIdTMDATA.filter((user: any) => (user._id).toString() !== userID);
  const updatedMembers = fiEverythingByIdMDATA.filter((user: any) => (user._id).toString() !== userID);

  return { updatedProjectManagers, updatedTeamLeaders, updatedMembers };
};

const findUserRole = (userID: string, owner: string, projectManagers?: Array<string>, teamLeaders?: Array<string>, members?: Array<string>): roles => {
  if (owner.toString() === userID) return "owner";
  if (projectManagers && projectManagers.includes(userID)) return "projectManagers";
  if (teamLeaders && teamLeaders.includes(userID)) return "teamLeaders";
  if (members && members.includes(userID)) return "members";
  return undefined;
};


// * POST /teams
export const createTeam = async (userID: string, title: string, description: string, projectManagers?: Array<string>, teamLeaders?: Array<string>, members?: Array<string>): Promise<defaultResponseType> => {

  if (userID === undefined) throw new statusCodeErrors("Incomplete data.", 400);
  if (title === undefined) throw new statusCodeErrors("Incomplete data.", 400);

  // Filters
  const { updatedProjectManagers, updatedTeamLeaders, updatedMembers }: any = await filterTeams(userID, projectManagers, teamLeaders, members);

  // console.log("updatedProjectManagers", updatedProjectManagers);

  // Insert Team
  const inTeam: any = await teamRepository.insertTeam({
    title: title,
    description: description,
    owner: userID,
    // projectManagers: [""],
    // teamLeaders: [""],
    // members: [""],
    createdAt: new Date(),
  });
  if (!inTeam) throw new statusCodeErrors("Team creation error.", 400);

  // * Send invitation
  sendTeamInvitation(title, inTeam._id, userID, updatedProjectManagers, updatedTeamLeaders, updatedMembers);

  return {
    message: "Team created.",
    statusCode: 201
  };
};

// * PATCH /teams/:teamID
export const patchTeam = async (userID: string, teamID: string, title?: string, description?: string, projectManagers?: Array<string>, teamLeaders?: Array<string>, members?: Array<string>): Promise<defaultResponseType> => {

  if (userID === undefined) throw new statusCodeErrors("Incomplete data.", 400);
  if (teamID == undefined) throw new statusCodeErrors("Incomplete data.", 400);
  if (title === undefined && description === undefined && projectManagers === undefined && teamLeaders === undefined && members === undefined)
    throw new statusCodeErrors("There is no data to update.", 400);

  const fiOneTeamByID: any = await teamRepository.findOneTeamByID(teamID);
  if (!fiOneTeamByID) throw new statusCodeErrors("Team not found.", 404);

  // Filters
  const { updatedProjectManagers, updatedTeamLeaders, updatedMembers }: any = await filterTeams(userID, projectManagers, teamLeaders, members);

  // Role control
  const role: roles = findUserRole(userID, fiOneTeamByID.owner, fiOneTeamByID.projectManagers, fiOneTeamByID.teamLeaders, fiOneTeamByID.members);
  if (role === "members") throw new statusCodeErrors("Unauthorized access.", 401);

  // ! Tek Eksik: Bir kullanıcıya tek seferde 3 tane davet gönderilebiliyor. Bunu kısıtlamadın. - Front-end kısıtlasın?

  // !!! Mantık Şu:
  // !!! Team Leader veya Project Manager olan bir kullanıcı kendi rolünü hiçbir zaman değitiremez.
  // !!! Bu rolleri sadece owner değiştirebilir. Şeklinde ayarla

  // console.log("updatedProjectManagers", updatedProjectManagers);
  // console.log("updatedTeamLeaders", updatedTeamLeaders);
  // console.log("updatedMembers", updatedMembers);

  // console.log("fiOneTeamByID.projectManagers", fiOneTeamByID.projectManagers);
  // console.log("userID", userID);
  // const t = (fiOneTeamByID.projectManagers).filter()
  // console.log(t);

  // if (!role) console.log("team.service - role", role);
  // * Send invitation
  sendTeamInvitation(title === undefined ? fiOneTeamByID.title : title, teamID, userID, role, updatedProjectManagers, updatedTeamLeaders, updatedMembers);
  // if ((fiOneTeamByID.owner).toString() === userID) sendTeamInvitation(title === undefined ? fiOneTeamByID.title : title, teamID, userID, updatedProjectManagers, updatedTeamLeaders, updatedMembers); // Role: Owner
  // else if ((fiOneTeamByID.projectManagers).includes(userID)) sendTeamInvitation(title === undefined ? fiOneTeamByID.title : title, teamID, userID, undefined, updatedTeamLeaders, updatedMembers); // Role: Project Manager
  // else if ((fiOneTeamByID.teamLeaders).includes(userID)) sendTeamInvitation(title === undefined ? fiOneTeamByID.title : title, teamID, userID, undefined, undefined, updatedMembers); // Role: Team Leader
  // else throw new statusCodeErrors("Unauthorized access.", 401); // Role: NoN

  return {
    message: "Team updated.",
    statusCode: 201
  };
};