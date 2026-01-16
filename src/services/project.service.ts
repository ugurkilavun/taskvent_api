// Utils
import { statusCodeErrors, } from "../utils/customErrors.util";
// Repositories
import { insertProject, findOneProject, findProjectsByUserID, findProjectsByTeamID, findProjectsByTeamIDTest } from "../repositories/project.repository";
import { insertTeam, findTeamByTeamID, findTeamIDByUserID } from "../repositories/team.repository";
import { findTaskByUserID, findTaskForRoot } from "../repositories/task.repository";
import { findById_flu, findById_flu2 } from "../repositories/user.repository";
// import { findById_flu } from "../repositories/user.repository";
// Types
import { projectResponseType, projectsType, taskMemberType, tasksType, teamsType } from "../types/responses.type";

export const createProject = async (userID: string, teamID: Array<string>, title: string, description: string, tags: Array<string>): Promise<projectResponseType> => {

  // if (userID === undefined) throw new statusCodeErrors("Incomplete data.", 400);
  // if (title === undefined) throw new statusCodeErrors("Incomplete data.", 400);
  // if (teamID !== undefined) {
  //   // * teamID.length === 1
  //   if (teamID.length === 1) {
  //     const fiTeamByTeamID: any = await findTeamByTeamID(teamID[0]); // * findTeamByTeamID'yi kontrol et. Array oldu
  //     if (!fiTeamByTeamID) throw new statusCodeErrors("Team not found.", 404);
  //     if (fiTeamByTeamID.owner.toString() !== userID) throw new statusCodeErrors("Cannot add this team. You must be the team owner.", 401);
  //   };

  //   // * teamID.length > 1
  //   if (teamID.length > 1) {
  //     for (let teamIndex = 0; teamIndex <= teamID.length - 1; teamIndex++) {
  //       const fiTeamByTeamID: any = await findTeamByTeamID(teamID[teamIndex]); // * findTeamByTeamID'yi kontrol et. Array oldu
  //       if (!fiTeamByTeamID) throw new statusCodeErrors("Team not found.", 404);
  //       if (fiTeamByTeamID.owner.toString() !== userID) throw new statusCodeErrors("Cannot add this team. You must be the team owner.", 401);
  //     };
  //   };
  // };

  // const inProject: any = await insertProject({
  //   owner: userID,
  //   teamID: teamID,
  //   title: title,
  //   description: description,
  //   tags: tags,
  //   createdAt: new Date()
  // });
  // if (!inProject) throw new statusCodeErrors("Project creation error.", 401);

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

  // const fiTaskRoot: any = await findTaskForRoot(projectID);

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
  // tasks: [
  //           {
  //             taskID: "ssssss",
  //             description: "ssssss",
  //             startDate: "ssssss",
  //             endDate: "ssssss",
  //             priority: "ssssss",
  //             members: [
  //               {
  //                 firstname: "string",
  //                 lastname: "string",
  //                 username: "string",
  //               }
  //             ],
  //             status: "ssssss",
  //           }
  //         ],

  // !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!Here
  const taskDatas: tasksType = [];

  if (role === "owner") {

    const fiTaskForRoot: any = await findTaskForRoot(projectID);

    for (let taskIndex = 0; taskIndex <= fiTaskForRoot.length - 1; taskIndex++) {

      const members: taskMemberType = await findById_flu2(fiTaskForRoot[taskIndex].members);
      taskDatas.push({
        taskID: fiTaskForRoot[taskIndex]._id,
        description: fiTaskForRoot[taskIndex].description,
        startDate: fiTaskForRoot[taskIndex].startDate,
        endDate: fiTaskForRoot[taskIndex].endDate,
        priority: fiTaskForRoot[taskIndex].priority,
        members: members,
        status: fiTaskForRoot[taskIndex].status,
      });

      console.log(taskDatas);

    };
  };

  if (role === "projectManagers" || role === "teamLeaders") {
    const fiTaskForRoot: any = await findTaskForRoot(projectID);

    for (let taskIndex = 0; taskIndex <= fiTaskForRoot.length - 1; taskIndex++) {

      const members: taskMemberType = await findById_flu2(fiTaskForRoot[taskIndex].members);
      taskDatas.push({
        taskID: fiTaskForRoot[taskIndex]._id,
        description: fiTaskForRoot[taskIndex].description,
        startDate: fiTaskForRoot[taskIndex].startDate,
        endDate: fiTaskForRoot[taskIndex].endDate,
        priority: fiTaskForRoot[taskIndex].priority,
        members: members,
        status: fiTaskForRoot[taskIndex].status,
      });

      console.log(taskDatas);

    };
  };

  if (role === "members") {
    const fiTaskByUserID: any = await findTaskByUserID(projectID, [userID]);

    for (let taskIndex = 0; taskIndex <= fiTaskByUserID.length - 1; taskIndex++) {

      const members: taskMemberType = await findById_flu2(fiTaskByUserID[taskIndex].members);
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

    const owner: taskMemberType = await findById_flu2(fiTeamByTeamID[teamIndex].owner);
    const projectManagers: taskMemberType = await findById_flu2(fiTeamByTeamID[teamIndex].projectManagers);
    const teamLeaders: taskMemberType = await findById_flu2(fiTeamByTeamID[teamIndex].teamLeaders);
    const members: taskMemberType = await findById_flu2(fiTeamByTeamID[teamIndex].members);

    // console.log("owner:", owner);
    // console.log("projectManagers:", projectManagers);
    // console.log("teamLeaders", teamLeaders);
    // console.log("members:", members);

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

  // !Debugs
  console.log("\n\r-------------------------------=== * Main Varibles * ===-------------------------------");
  console.log(fiOneProject);

  console.log("\n\r-------------------------------=== * Team Varibles * ===-------------------------------");
  console.log(fiTeamByTeamID);

  console.log("\n\r-------------------------------=== * Role Varibles * ===-------------------------------");
  console.log("Role:", role);
  // !Debugs


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

  // ! Old Structure
  // // ! Task Functions
  // // * Tasks number < 1
  // const hasNoTasks = (): projectResponseType => {
  //   return {
  //     message: "Task not found.",
  //     projects: [
  //       {
  //         projectID: fiOneProject._id,
  //         title: fiOneProject.title,
  //         description: fiOneProject.title,
  //         tags: fiOneProject.tags,
  //         createdAt: fiOneProject.createdAt,
  //         owned: false,
  //       }
  //     ],
  //     HTTPStatusCode: 200
  //   };
  // };

  // // * Tasks Number > 1
  // const hasMultipleTasks = async (value: any): Promise<void> => {
  //   for (let taskIndex = 0; taskIndex <= value.length - 1; taskIndex++) {

  //     // ? Members === 1
  //     if (value[taskIndex].members.length === 1) {
  //       const taskMembers: any = await findById_flu(value[taskIndex].members);

  //       taskDATAS.push({
  //         taskID: value[taskIndex]._id,
  //         description: value[taskIndex].description,
  //         startDate: value[taskIndex].startDate,
  //         endDate: value[taskIndex].endDate,
  //         priority: value[taskIndex].priority,
  //         members: taskMembers === null ? [{
  //           firstname: "null",
  //           lastname: "null",
  //           username: "nullnull"
  //         }] : [{
  //           firstname: taskMembers.firstname,
  //           lastname: taskMembers.lastname,
  //           username: taskMembers.username
  //         }],
  //         status: value[taskIndex].status,
  //       });

  //     }

  //     // ? Members > 1
  //     else if (value[taskIndex].members.length > 1) {

  //       const tempTaskMemberDATAS: taskMemberType = [];
  //       for (let memberIndex = 0; memberIndex <= value[taskIndex].members.length - 1; memberIndex++) {
  //         const taskMembers: any = await findById_flu(value[taskIndex].members[memberIndex]);

  //         if (taskMembers !== null) tempTaskMemberDATAS.push({
  //           firstname: taskMembers.firstname,
  //           lastname: taskMembers.lastname,
  //           username: taskMembers.username
  //         });
  //         else tempTaskMemberDATAS.push({
  //           firstname: "null",
  //           lastname: "null",
  //           username: "nullnull"
  //         }); // User is not found
  //       }

  //       taskDATAS.push({
  //         taskID: value[taskIndex]._id,
  //         description: value[taskIndex].description,
  //         startDate: value[taskIndex].startDate,
  //         endDate: value[taskIndex].endDate,
  //         priority: value[taskIndex].priority,
  //         members: tempTaskMemberDATAS,
  //         status: value[taskIndex].status,
  //       });

  //     }

  //     // ? Members: unknown
  //     else throw new statusCodeErrors("Task member error.", 400);
  //   }
  // };

  // // * Tasks number === 1
  // const hasSingleTask = async (value: any): Promise<void> => {
  //   // ? Members === 1
  //   if (value[0].members.length === 1) {
  //     const taskMembers: any = await findById_flu(value[0].members);

  //     taskDATAS.push({
  //       taskID: value[0]._id,
  //       description: value[0].description,
  //       startDate: value[0].startDate,
  //       endDate: value[0].endDate,
  //       priority: value[0].priority,
  //       members: taskMembers === null ? [{
  //         firstname: "null",
  //         lastname: "null",
  //         username: "nullnull"
  //       }] : [{
  //         firstname: taskMembers.firstname,
  //         lastname: taskMembers.lastname,
  //         username: taskMembers.username
  //       }],
  //       status: value[0].status,
  //     });

  //   }

  //   // ? Members > 1
  //   else if (value[0].members.length > 1) {

  //     const tempTaskMemberDATAS: taskMemberType = [];

  //     for (let memberIndex = 0; memberIndex <= value[0].members.length - 1; memberIndex++) {
  //       const taskMembers: any = await findById_flu(value[0].members[memberIndex]);

  //       if (taskMembers !== null) tempTaskMemberDATAS.push({
  //         firstname: taskMembers.firstname,
  //         lastname: taskMembers.lastname,
  //         username: taskMembers.username
  //       });
  //       else tempTaskMemberDATAS.push({
  //         firstname: "null",
  //         lastname: "null",
  //         username: "nullnull"
  //       }); // User is not found
  //     }

  //     taskDATAS.push({
  //       taskID: value[0]._id,
  //       description: value[0].description,
  //       startDate: value[0].startDate,
  //       endDate: value[0].endDate,
  //       priority: value[0].priority,
  //       members: tempTaskMemberDATAS,
  //       status: value[0].status,
  //     });

  //   }

  //   // ? Members: unknown
  //   else throw new statusCodeErrors("Task member error.", 400);

  // };

  // const taskDATAS: taskType = [];

  // if (fiOneProject.teamID.length === 1) {
  //   const fiTeamByTeamID: any = await findTeamByTeamID(fiOneProject.teamID[0]);

  //   // * Owner
  //   if (fiTeamByTeamID.owner.toString() === userID) {

  //     const fiTaskRoot: any = await findTaskForRoot(projectID);

  //     // ? Tasks number < 1
  //     if (fiTaskRoot.length < 1) return hasNoTasks();

  //     // ? Tasks Number > 1
  //     if (fiTaskRoot.length > 1) await hasMultipleTasks(fiTaskRoot);

  //     // ? Tasks number === 1
  //     if (fiTaskRoot.length === 1) await hasSingleTask(fiTaskRoot);
  //   }

  //   // * Project manager
  //   else if (fiTeamByTeamID.projectManagers.includes(userID)) {

  //     const fiTaskRoot: any = await findTaskForRoot(projectID);

  //     // ? Tasks number < 1
  //     if (fiTaskRoot.length < 1) return hasNoTasks()

  //     // ? Tasks Number > 1
  //     if (fiTaskRoot.length > 1) await hasMultipleTasks(fiTaskRoot);

  //     // ? Tasks number === 1
  //     if (fiTaskRoot.length === 1) await hasSingleTask(fiTaskRoot);

  //   }

  //   // * Team leader
  //   else if (fiTeamByTeamID.teamLeaders.includes(userID)) {

  //     const fiTaskRoot: any = await findTaskForRoot(projectID);

  //     // ? Tasks number < 1
  //     if (fiTaskRoot.length < 1) return hasNoTasks();

  //     // ? Tasks Number > 1
  //     if (fiTaskRoot.length > 1) await hasMultipleTasks(fiTaskRoot);

  //     // ? Tasks number === 1
  //     if (fiTaskRoot.length === 1) await hasSingleTask(fiTaskRoot);
  //   }

  //   // * Member
  //   else if (fiTeamByTeamID.members.includes(userID)) {

  //     const fiTaskByUserID: any = await findTaskByUserID(projectID, [userID]);

  //     // ? Tasks number < 1
  //     if (fiTaskByUserID.length < 1) return hasNoTasks();

  //     // ? Tasks Number > 1
  //     if (fiTaskByUserID.length > 1) await hasMultipleTasks(fiTaskByUserID);

  //     // ? Tasks number === 1
  //     if (fiTaskByUserID.length === 1) await hasSingleTask(fiTaskByUserID);
  //   }
  //   else {
  //     throw new statusCodeErrors("Unauthorized access.", 401);
  //   }

  // };

  // if (fiOneProject.teamID.length > 1) {

  //   let isMember: boolean = false;
  //   let tempRole: "owner" | "projectManagers" | "teamLeaders" | "member";

  //   for (let teamIndex = 0; teamIndex <= fiOneProject.teamID.length - 1; teamIndex++) {
  //     const fiTeamByTeamID: any = await findTeamByTeamID(fiOneProject.teamID[teamIndex]);
  //     // * Owner
  //     if (fiTeamByTeamID.owner.toString() === userID) {
  //       isMember = true;
  //       tempRole = "owner";
  //       break;
  //     };

  //     // * Project manager
  //     if (fiTeamByTeamID.projectManagers.includes(userID)) {
  //       isMember = true;
  //       tempRole = "projectManagers";
  //       break;
  //     };

  //     // * Team leader
  //     if (fiTeamByTeamID.teamLeaders.includes(userID)) {
  //       isMember = true;
  //       tempRole = "teamLeaders";
  //       break;
  //     };

  //     // * Member
  //     if (fiTeamByTeamID.members.includes(userID)) {
  //       isMember = true;
  //       tempRole = "member";
  //       break;
  //     };

  //   };

  //   if (!isMember) throw new statusCodeErrors("Unauthorized access.", 401);

  //   // * Owner
  //   if (tempRole === "owner") {

  //     const fiTaskRoot: any = await findTaskForRoot(projectID);

  //     // ? Tasks number < 1
  //     if (fiTaskRoot.length < 1) return hasNoTasks();

  //     // ? Tasks Number > 1
  //     if (fiTaskRoot.length > 1) await hasMultipleTasks(fiTaskRoot);

  //     // ? Tasks number === 1
  //     if (fiTaskRoot.length === 1) await hasSingleTask(fiTaskRoot);
  //   }

  //   // * Project manager
  //   else if (tempRole === "projectManagers") {

  //     const fiTaskRoot: any = await findTaskForRoot(projectID);

  //     // ? Tasks number < 1
  //     if (fiTaskRoot.length < 1) return hasNoTasks()

  //     // ? Tasks Number > 1
  //     if (fiTaskRoot.length > 1) await hasMultipleTasks(fiTaskRoot);

  //     // ? Tasks number === 1
  //     if (fiTaskRoot.length === 1) await hasSingleTask(fiTaskRoot);

  //   }

  //   // * Team leader
  //   else if (tempRole === "teamLeaders") {

  //     const fiTaskRoot: any = await findTaskForRoot(projectID);

  //     // ? Tasks number < 1
  //     if (fiTaskRoot.length < 1) return hasNoTasks();

  //     // ? Tasks Number > 1
  //     if (fiTaskRoot.length > 1) await hasMultipleTasks(fiTaskRoot);

  //     // ? Tasks number === 1
  //     if (fiTaskRoot.length === 1) await hasSingleTask(fiTaskRoot);
  //   }

  //   // * Member
  //   else if (tempRole === "member") {

  //     const fiTaskByUserID: any = await findTaskByUserID(projectID, [userID]);

  //     // ? Tasks number < 1
  //     if (fiTaskByUserID.length < 1) return hasNoTasks();

  //     // ? Tasks Number > 1
  //     if (fiTaskByUserID.length > 1) await hasMultipleTasks(fiTaskByUserID);

  //     // ? Tasks number === 1
  //     if (fiTaskByUserID.length === 1) await hasSingleTask(fiTaskByUserID);
  //   }
  //   else {
  //     throw new statusCodeErrors("Unauthorized access.", 401);
  //   }

  // };

  // if (fiOneProject.teamID.length < 1) {
  //   if (fiOneProject.owner.toString() !== userID) throw new statusCodeErrors("Unauthorized access.", 401);
  // };

  // return {
  //   message: "Project found.",
  //   projects: [
  //     {
  //       projectID: fiOneProject._id,
  //       title: fiOneProject.title,
  //       description: fiOneProject.title,
  //       tags: fiOneProject.tags,
  //       createdAt: fiOneProject.createdAt,
  //       task: taskDATAS.length >= 1 && taskDATAS,
  //       owned: false,
  //     }
  //   ],

  //   HTTPStatusCode: 200
  // };

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
  const fiProjectsByTeamID: any = await findProjectsByTeamIDTest(teamIDs);

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