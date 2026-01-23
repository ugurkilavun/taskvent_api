// Utils
import { statusCodeErrors, } from "../utils/customErrors.util";
// Repositories
import { insertProject, findOneProject, findProjectsByUserID, findProjectsByTeamID } from "../repositories/project.repository";
import { insertTeam, findTeamByTeamID, findTeamIDByUserID } from "../repositories/team.repository";
import { findTaskByUserID, findTaskForRoot } from "../repositories/task.repository";
import { findById_flu } from "../repositories/user.repository";
// Types
import { projectResponseType, projectsType, taskMemberType, tasksType, teamsType } from "../types/responses.type";

export const createProject = async (userID: string, teamID: Array<string>, title: string, description: string, tags: Array<string>): Promise<projectResponseType> => {

  if (userID === undefined) throw new statusCodeErrors("Incomplete data.", 400);
  if (title === undefined) throw new statusCodeErrors("Incomplete data.", 400);

  const fiTeamByTeamIDTest: any = await findTeamByTeamID(teamID);

  // Team not found
  if (typeof teamID === "object")
    if (fiTeamByTeamIDTest.length !== teamID.length) throw new statusCodeErrors("Team not found.", 404);

  // Team owner
  fiTeamByTeamIDTest.map((data: any) => {
    if (data.owner.toString() !== userID) throw new statusCodeErrors("Cannot add this team. You must be the team owner.", 401);
  });

  const inProject: any = await insertProject({
    owner: userID,
    teamID: teamID,
    title: title,
    description: description,
    tags: tags,
    createdAt: new Date()
  });
  if (!inProject) throw new statusCodeErrors("Project creation error.", 401);

  return {
    message: "Project created.",
    HTTPStatusCode: 201
  };

};

// * /projects/:projectID
export const getProject = async (userID: string, projectID: string): Promise<projectResponseType> => {

  if (userID === undefined) throw new statusCodeErrors("Incomplete data.", 400);
  if (projectID === undefined) throw new statusCodeErrors("Incomplete data.", 400);

  const fiOneProject: any = await findOneProject(projectID);
  if (!fiOneProject) throw new statusCodeErrors("Project not found.", 404);

  const fiTeamByTeamID: any = await findTeamByTeamID(fiOneProject.teamID);

  // ? Role operations
  let role: string = undefined;

  // Roles: projectManagers, teamLeaders, members
  if (fiOneProject.owner.toString() === userID) role = "owner";
  else {
    for (let teamIndex = 0; teamIndex <= fiTeamByTeamID.length - 1; teamIndex++) {
      if (fiTeamByTeamID[teamIndex].projectManagers.includes(userID)) role = "projectManagers";
      if (fiTeamByTeamID[teamIndex].teamLeaders.includes(userID)) role = "teamLeaders";
      if (fiTeamByTeamID[teamIndex].members.includes(userID)) role = "members";
    };
  }

  if (role === undefined) throw new statusCodeErrors("Unauthorized access.", 401);

  // ? Task operations
  const taskDatas: tasksType = [];

  if (role === "owner") {

    const fiTaskForRoot: any = await findTaskForRoot(projectID);

    for (let taskIndex = 0; taskIndex <= fiTaskForRoot.length - 1; taskIndex++) {

      const members: taskMemberType = await findById_flu(fiTaskForRoot[taskIndex].members);
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
    const fiTaskForRoot: any = await findTaskForRoot(projectID);

    for (let taskIndex = 0; taskIndex <= fiTaskForRoot.length - 1; taskIndex++) {

      const members: taskMemberType = await findById_flu(fiTaskForRoot[taskIndex].members);
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
    const fiTaskByUserID: any = await findTaskByUserID(projectID, [userID]);

    for (let taskIndex = 0; taskIndex <= fiTaskByUserID.length - 1; taskIndex++) {

      const members: taskMemberType = await findById_flu(fiTaskByUserID[taskIndex].members);
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

    const owner: taskMemberType = await findById_flu(fiTeamByTeamID[teamIndex].owner);
    const projectManagers: taskMemberType = await findById_flu(fiTeamByTeamID[teamIndex].projectManagers);
    const teamLeaders: taskMemberType = await findById_flu(fiTeamByTeamID[teamIndex].teamLeaders);
    const members: taskMemberType = await findById_flu(fiTeamByTeamID[teamIndex].members);

    teamDatas.push({
      teamID: fiTeamByTeamID[teamIndex]._id,
      title: fiTeamByTeamID[teamIndex].title,
      description: fiTeamByTeamID[teamIndex].description,
      owner: owner,
      projectManagers: projectManagers.length > 0 ? projectManagers : undefined,
      teamLeaders: teamLeaders.length > 0 ? teamLeaders : undefined,
      members: members.length > 0 ? members : undefined,
    });
  };

  return {
    message: "Project found.",
    projects: [
      {
        projectID: fiOneProject._id,
        title: fiOneProject.title,
        description: fiOneProject.description,
        tags: fiOneProject.tags,
        createdAt: fiOneProject.createdAt,
        tasks: taskDatas,
        teams: teamDatas,
        owned: true,
      }
    ],

    HTTPStatusCode: 200
  };

};

// * /projects
export const getProjects = async (userID: string): Promise<projectResponseType> => {

  if (userID === undefined) throw new statusCodeErrors("Incomplete data.", 400);

  // Role: Member
  const fiTeamIDByUserID: any = await findTeamIDByUserID(userID);
  // Role: Owner
  const fiProjectsByUserID: any = await findProjectsByUserID(userID);

  if (fiProjectsByUserID.length === 0 && fiTeamIDByUserID.length === 0) return {
    message: "Project(s) not found.",
    HTTPStatusCode: 200
  };

  // * Member projects
  const memberProjectsDATA: projectsType = [];
  const teamIDs: Array<string> = fiTeamIDByUserID.map((item: any) => item._id);
  const fiProjectsByTeamID: any = await findProjectsByTeamID(teamIDs);

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

  // Integrated
  let projects: projectsType = ownedProjectsDATA.concat(memberProjectsDATA);

  return {
    message: "Project(s) found.",
    projects: projects,
    HTTPStatusCode: 200
  };

};