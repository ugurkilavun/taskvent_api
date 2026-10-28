// Services
import { sendProjectInvitation } from "./invitations/project-invitation.service";
// Utils
import { statusCodeErrors, } from "../utils/customErrors.util";
// Repositories
import { ProjectRepository } from "../repositories/project.repository";
import { TeamRepository } from "../repositories/team.repository";
import { TaskRepository } from "../repositories/task.repository";
import { UserRepository } from "../repositories/user.repository";
// Types
import { projectsType, taskMemberType, tasksType, teamsType } from "../types/projects.type";
import { defaultResponseType } from "../types/responses.type";

// Class
const projectRepository = new ProjectRepository();
const teamRepository = new TeamRepository();
const taskRepository = new TaskRepository();
const userRepository = new UserRepository();

// ? Functions

// Find role
const findRole = async (userID: string, owner: string, team: any): Promise<string | undefined> => {

  if (owner === userID) return "owner";
  else {
    for (let teamIndex = 0; teamIndex <= team.length - 1; teamIndex++) {
      if (team[teamIndex].projectManagers.includes(userID)) return "projectManagers";
      if (team[teamIndex].teamLeaders.includes(userID)) return "teamLeaders";
      if (team[teamIndex].members.includes(userID)) return "members";
    };
  };

  return undefined;
};


// * POST /projects
export const createProject = async (userID: string, teamID: Array<string>, title: string, description: string, tags: Array<string>): Promise<defaultResponseType> => {

  if (userID === undefined) throw new statusCodeErrors("Incomplete data.", 400);
  if (title === undefined) throw new statusCodeErrors("Incomplete data.", 400);

  const uniqueTeamIDs = [...new Set(teamID)];

  const fiTeamByTeamIDQuery: any = await teamRepository.findTeamByTeamID(uniqueTeamIDs);

  // Team not found
  if (typeof teamID === "object")
    if (fiTeamByTeamIDQuery.length !== uniqueTeamIDs.length) throw new statusCodeErrors("Team not found.", 404);

  // * ------------
  const myTeams: Array<string> = [];
  for (let index = 0; index <= uniqueTeamIDs.length - 1; index++) {
    const findTeamByTUIDDATA: any = await teamRepository.findTeamByTUID(userID, uniqueTeamIDs[index]);
    if (findTeamByTUIDDATA.length >= 1) myTeams.push((findTeamByTUIDDATA[0]._id).toString());
  };

  const myTeamsSet = new Set(myTeams);
  const invitationTeams: string[] = uniqueTeamIDs.filter((item) => !myTeamsSet.has(item));

  const inProject: any = await projectRepository.insertProject({
    owner: userID,
    teamID: myTeams,
    title: title,
    description: description,
    tags: tags,
    createdAt: new Date()
  });
  if (!inProject) throw new statusCodeErrors("Project creation error.", 400);

  // Send invitation
  sendProjectInvitation(title, inProject._id, userID, invitationTeams);

  return {
    message: "Project created.",
    statusCode: 201
  };

};

// * GET /projects
export const getProjects = async (userID: string): Promise<defaultResponseType> => {

  if (userID === undefined) throw new statusCodeErrors("Incomplete data.", 400);

  // Role: Member
  const fiTeamIDByUserID: any = await teamRepository.findTeamIDByUserID(userID);
  // Role: Owner
  const fiProjectsByUserID: any = await projectRepository.findProjectsByUserID(userID);

  if (fiProjectsByUserID.length === 0 && fiTeamIDByUserID.length === 0)
    return {
      message: "Project(s) not found.",
      statusCode: 200
    };

  // * Member projects
  const memberProjectsDATA: projectsType = [];
  const teamIDs: Array<string> = fiTeamIDByUserID.map((item: any) => item._id);
  const fiProjectsByTeamID: any = await projectRepository.findProjectsByTeamID(teamIDs);

  for (let ProjectIndex = 0; ProjectIndex <= fiProjectsByTeamID.length - 1; ProjectIndex++) {
    memberProjectsDATA.push({
      projectID: fiProjectsByTeamID[ProjectIndex]._id,
      title: fiProjectsByTeamID[ProjectIndex].title,
      description: fiProjectsByTeamID[ProjectIndex].title,
      tags: fiProjectsByTeamID[ProjectIndex].tags,
      createdAt: fiProjectsByTeamID[ProjectIndex].createdAt,
      owned: false,
    });
  };

  // * For owned projects
  const ownedProjectsDATA: projectsType = [];

  for (let ProjectIndex = 0; ProjectIndex <= fiProjectsByUserID.length - 1; ProjectIndex++) {
    ownedProjectsDATA.push({
      projectID: fiProjectsByUserID[ProjectIndex]._id,
      title: fiProjectsByUserID[ProjectIndex].title,
      description: fiProjectsByUserID[ProjectIndex].title,
      tags: fiProjectsByUserID[ProjectIndex].tags,
      createdAt: fiProjectsByUserID[ProjectIndex].createdAt,
      owned: true,
    });
  };

  // Combine
  const data: projectsType = ownedProjectsDATA.concat(memberProjectsDATA);

  return {
    message: "Project(s) found.",
    statusCode: 200,
    data: data
  };

};

// * GET /projects/:projectID
export const getProject = async (userID: string, projectID: string): Promise<defaultResponseType> => {

  if (userID === undefined) throw new statusCodeErrors("Incomplete data.", 400);
  if (projectID === undefined) throw new statusCodeErrors("Incomplete data.", 400);

  const fiOneProject: any = await projectRepository.findOneProject(projectID);
  if (!fiOneProject) throw new statusCodeErrors("Project not found.", 404);

  const fiTeamByTeamID: any = await teamRepository.findTeamByTeamID(fiOneProject.teamID);

  // ? Role operations
  const role: string | undefined = await findRole(userID, fiOneProject.owner.toString(), fiTeamByTeamID);
  let projectOwner: boolean = false;

  if (role === undefined) throw new statusCodeErrors("Unauthorized access.", 401);


  // ? Task operations
  const taskDatas: tasksType = [];

  if (role === "owner") {
    projectOwner = true;
    const fiTaskForRoot: any = await taskRepository.findTaskForRoot(projectID);

    for (let taskIndex = 0; taskIndex <= fiTaskForRoot.length - 1; taskIndex++) {

      const members: taskMemberType = await userRepository.findById_flu(fiTaskForRoot[taskIndex].members);
      taskDatas.push({
        taskID: fiTaskForRoot[taskIndex]._id,
        description: fiTaskForRoot[taskIndex].description,
        startDate: fiTaskForRoot[taskIndex].startDate,
        endDate: fiTaskForRoot[taskIndex].endDate,
        priority: fiTaskForRoot[taskIndex].priority,
        members: members,
        status: fiTaskForRoot[taskIndex].status,
      });

    };
  };

  if (role === "projectManagers" || role === "teamLeaders") {
    const fiTaskForRoot: any = await taskRepository.findTaskForRoot(projectID);

    for (let taskIndex = 0; taskIndex <= fiTaskForRoot.length - 1; taskIndex++) {

      const members: taskMemberType = await userRepository.findById_flu(fiTaskForRoot[taskIndex].members);
      taskDatas.push({
        taskID: fiTaskForRoot[taskIndex]._id,
        description: fiTaskForRoot[taskIndex].description,
        startDate: fiTaskForRoot[taskIndex].startDate,
        endDate: fiTaskForRoot[taskIndex].endDate,
        priority: fiTaskForRoot[taskIndex].priority,
        members: members,
        status: fiTaskForRoot[taskIndex].status,
      });

    };
  };

  if (role === "members") {
    const fiTaskByUserID: any = await taskRepository.findTaskByUserID(projectID, [userID]);

    for (let taskIndex = 0; taskIndex <= fiTaskByUserID.length - 1; taskIndex++) {

      const members: taskMemberType = await userRepository.findById_flu(fiTaskByUserID[taskIndex].members);
      taskDatas.push({
        taskID: fiTaskByUserID[taskIndex]._id,
        description: fiTaskByUserID[taskIndex].description,
        startDate: fiTaskByUserID[taskIndex].startDate,
        endDate: fiTaskByUserID[taskIndex].endDate,
        priority: fiTaskByUserID[taskIndex].priority,
        members: members,
        status: fiTaskByUserID[taskIndex].status,
      });

    };
  };


  // ? Team operations
  const teamDatas: teamsType = [];

  for (let teamIndex = 0; teamIndex <= fiTeamByTeamID.length - 1; teamIndex++) {

    const owner: taskMemberType = await userRepository.findById_flu(fiTeamByTeamID[teamIndex].owner);
    const projectManagers: taskMemberType = await userRepository.findById_flu(fiTeamByTeamID[teamIndex].projectManagers);
    const teamLeaders: taskMemberType = await userRepository.findById_flu(fiTeamByTeamID[teamIndex].teamLeaders);
    const members: taskMemberType = await userRepository.findById_flu(fiTeamByTeamID[teamIndex].members);

    teamDatas.push({
      teamID: fiTeamByTeamID[teamIndex]._id,
      title: fiTeamByTeamID[teamIndex].title,
      description: fiTeamByTeamID[teamIndex].description,
      owner: owner,
      projectManagers: projectManagers.length >= 1 ? projectManagers : undefined,
      teamLeaders: teamLeaders.length >= 1 ? teamLeaders : undefined,
      members: members.length >= 1 ? members : undefined,
    });
  };

  return {
    message: "Project found.",
    statusCode: 200,
    data: [
      {
        projectID: fiOneProject._id,
        title: fiOneProject.title,
        description: fiOneProject.description,
        tags: fiOneProject.tags,
        createdAt: fiOneProject.createdAt,
        tasks: taskDatas.length >= 1 ? taskDatas : undefined,
        teams: teamDatas,
        owned: projectOwner,
      }
    ],
  };

};

// * PATCH /projects/:projectID
export const patchProject = async (userID: string, projectID: string, teamID?: Array<string>, title?: string, description?: string, tags?: Array<string>): Promise<defaultResponseType> => {

  if (userID === undefined) throw new statusCodeErrors("Incomplete data.", 400);
  if (projectID == undefined) throw new statusCodeErrors("Incomplete data.", 400);
  if (teamID === undefined && title === undefined && description === undefined && tags === undefined) throw new statusCodeErrors("There is no data to update.", 400);

  const fiOneProject: any = await projectRepository.findOneProject(projectID);
  if (!fiOneProject) throw new statusCodeErrors("Project not found.", 404);

  const uniqueTeamIDs = [...new Set(teamID)];
  const fiTeamByTeamID: any = await teamRepository.findTeamByTeamID(uniqueTeamIDs);

  // Teams
  const findOneProjectDATA: any = await projectRepository.findOneProject(projectID);
  const projectTeams = findOneProjectDATA.teamID;
  const newTeams: Array<string> = [];

  uniqueTeamIDs.map((item: string) => {
    if (!projectTeams.includes(item.toString())) newTeams.push(item);
  });

  // Team not found
  if (typeof teamID === "object")
    if (fiTeamByTeamID.length !== uniqueTeamIDs.length) throw new statusCodeErrors("Team not found.", 404);

  // Role control
  const findTeamByTeamIDForRole: any = await teamRepository.findTeamByTeamID(fiOneProject.teamID);
  const role: string | undefined = await findRole(userID, fiOneProject.owner.toString(), findTeamByTeamIDForRole);
  if (role === "members" || role === undefined) throw new statusCodeErrors("Unauthorized access.", 401);

  // * TR: X Projesi’nde yer alan takımlardaki yetkili kullanıcılar, kendi takımlarını davet beklemeksizin X Projesi’ne ekleyebilir.
  // * EN: Authorized users from teams already included in Project X can add their own teams to Project X without requiring an invitation.
  const teamsToBeAdded: Array<string> = [];
  const teamsToBeInvited: Array<string> = [];

  fiTeamByTeamID.map((data: any) => {
    if ((data.owner).toString() === userID) teamsToBeAdded.push((data._id).toString());
    else teamsToBeInvited.push((data._id).toString());
  });

  // Update
  const updateProject = projectRepository.updateProjectsByProjectID(projectID, teamsToBeAdded, title, description, tags);
  if (!updateProject) throw new statusCodeErrors("Update error.", 400);

  // Send invitation
  sendProjectInvitation(!title ? fiOneProject.title : title, projectID, userID, teamsToBeInvited);

  return {
    message: "Project updated.",
    statusCode: 200
  };

};