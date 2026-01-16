// // Utils
// import { statusCodeErrors } from "../utils/customErrors.util";
// // Repositories
// import { findByUsername } from "../repositories/user.repository";
// import { insertProject, findOneProject } from "../repositories/project.repository";
// import { insertTeam, findTeamByUserID } from "../repositories/team.repository";
// import { insertTask, findTaskByUserID, findTaskForRoot, findTaskByID } from "../repositories/task.repository";
// import { findById_flu, findById } from "../repositories/user.repository";
// // Types
// import { authResponseType, taskMemberType, taskType } from "../types/responses.type";

// export const createTask = async (userID: string, projectID: string, description: string, startDate: Date, endDate: Date, priority: string, members: [string]): Promise<authResponseType> => {

//   // undefined?
//   if (userID === undefined) throw new statusCodeErrors("Incomplete data.", 400);
//   if (projectID === undefined) throw new statusCodeErrors("Incomplete data.", 400);
//   if (priority === undefined) throw new statusCodeErrors("Incomplete data.", 400);
//   if (members === undefined) throw new statusCodeErrors("Incomplete data.", 400);

//   // Is there a project?
//   const fiOneProject: any = await findOneProject(projectID);
//   if (!fiOneProject) throw new statusCodeErrors("Project not found.", 404);

//   // Is the user part of this project’s team?
//   const fiTeamWithUser: any = await findTeamByUserID(projectID, userID);
//   if (!fiTeamWithUser) throw new statusCodeErrors("Project not found.", 404);

//   if (fiTeamWithUser.role !== "projectmanager" && fiTeamWithUser.role !== "teamleader") throw new statusCodeErrors("Unauthorized access.", 401);

//   console.log(members);

//   // Are the members part of this project’s team?
//   for (let index = 0; index <= members.length - 1; index++) {
//     const userAvailable: any = await findByUsername(members[index]);
//     if (!userAvailable) throw new statusCodeErrors("User not found.", 404);

//     const fiTeamWithUser_members: any = await findTeamByUserID(projectID, userAvailable._id);
//     if (!fiTeamWithUser_members) throw new statusCodeErrors("User not in project team.", 401);
//   };

//   const inTask: any = insertTask({
//     projectID: projectID,
//     description: description,
//     startDate: startDate,
//     endDate: endDate,
//     priority: priority,
//     members: members,
//     status: "process"
//   });
//   if (!inTask) throw new statusCodeErrors("Task not created.", 401);

//   return {
//     message: "Task created.",
//     userID: userID,
//     HTTPStatusCode: 201
//   };

// };

// export const getTask = async (userID: string, projectID: string, taskID: string): Promise<authResponseType> => {

//   // console.log(userID, projectID, taskID);

//   if (userID === undefined) throw new statusCodeErrors("Incomplete data.", 400);
//   if (projectID === undefined) throw new statusCodeErrors("Incomplete data.", 400);
//   if (taskID === undefined) throw new statusCodeErrors("Incomplete data.", 400);

//   const fiOneProject: any = await findOneProject(projectID);
//   if (!fiOneProject) throw new statusCodeErrors("Project not found.", 404);

//   const fiTeamWithUser: any = await findTeamByUserID(projectID, userID);
//   if (!fiTeamWithUser) throw new statusCodeErrors("Project not found.", 404);

//   const fiTaskByID: any = await findTaskByID(taskID);
//   if (!fiTaskByID) throw new statusCodeErrors("Task not found.", 404);

//   const taskDATAS: taskType = [];

//   // * Members < 1
//   const hasNoMembers = (): void => {
//     console.log("hasNoMembers");
//     taskDATAS.push({
//       taskID: fiTaskByID._id,
//       description: fiTaskByID.description,
//       startDate: fiTaskByID.startDate,
//       endDate: fiTaskByID.endDate,
//       priority: fiTaskByID.priority,
//       members: [{
//         firstname: "null",
//         lastname: "null",
//         username: "nullnull"
//       }],
//       status: fiTaskByID.status,
//     });
//   };

//   // * Members > 1
//   const hasMultipleMembers = async (): Promise<void> => {
//     const members: taskMemberType = [];

//     for (let memberIndex = 0; memberIndex <= fiTaskByID.members.length - 1; memberIndex++) {
//       const userInformation: any = await findByUsername(fiTaskByID.members[memberIndex]);
//       members.push({
//         firstname: userInformation.firstname,
//         lastname: userInformation.lastname,
//         username: userInformation.username
//       });
//     };

//     taskDATAS.push({
//       taskID: fiTaskByID._id,
//       description: fiTaskByID.description,
//       startDate: fiTaskByID.startDate,
//       endDate: fiTaskByID.endDate,
//       priority: fiTaskByID.priority,
//       members: members,
//       status: fiTaskByID.status,
//     });
//   };

//   // * Members === 1
//   const hasSingleMembers = async (): Promise<void> => {
//     const userInformation: any = await findByUsername(fiTaskByID.members[0]);
//     taskDATAS.push({
//       taskID: fiTaskByID._id,
//       description: fiTaskByID.description,
//       startDate: fiTaskByID.startDate,
//       endDate: fiTaskByID.endDate,
//       priority: fiTaskByID.priority,
//       members: [{
//         firstname: userInformation.firstname,
//         lastname: userInformation.lastname,
//         username: userInformation.username
//       }],
//       status: fiTaskByID.status,
//     });
//   };

//   // * Role: projectmanager | teamleader
//   if (fiTeamWithUser.role === "projectmanager" || fiTeamWithUser.role === "teamleader") {

//     if (fiTaskByID.members.length < 1) hasNoMembers();

//     if (fiTaskByID.members.length > 1) await hasMultipleMembers();

//     if (fiTaskByID.members.length === 1) await hasSingleMembers();

//   }
//   // * Role: member
//   else if (fiTeamWithUser.role === "member") {

//     const fiById: any = await findById(userID);
//     if (!fiById) throw new statusCodeErrors("Task error.", 401);

//     if (fiTaskByID.members.includes(fiById.username)) {

//       if (fiTaskByID.members.length < 1) hasNoMembers();

//       if (fiTaskByID.members.length > 1) await hasMultipleMembers();

//       if (fiTaskByID.members.length === 1) await hasSingleMembers();

//     } else throw new statusCodeErrors("Unauthorized for this task.", 401);
//   }
//   // * Role: any:?
//   else throw new statusCodeErrors("Project not found.", 404);

//   return {
//     message: "Task found.",
//     tasks: taskDATAS,
//     HTTPStatusCode: 200
//   };
// };