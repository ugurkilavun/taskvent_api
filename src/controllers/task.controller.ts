// import { Request, Response } from 'express';
// // Services
// import { createTask, getTask } from "../services/task.service";
// // Utils
// import { AuthExceptionHandler } from '../utils/customErrorHandlers.util';

// // Class
// const AuthExceptionHandlerTemp = new AuthExceptionHandler();

// export const createTaskController = async (req: Request, res: Response) => {

//   // Datas
//   const projectID: string = req.params.projectid;
//   const { userID, description, startDate, endDate, priority, members }: any | undefined = req.body;

//   await AuthExceptionHandlerTemp.Handle(
//     { file: "projects", level: "RESPONSE", logType: "project", service: "project.service" },
//     req,
//     res,
//     () => createTask(userID, projectID, description, startDate, endDate, priority, members)
//   );
// };

// export const getTaskController = async (req: Request, res: Response) => {

//   // Datas
//   const userID: string = req.params.userID;
//   const projectID: string = req.params.projectid;
//   const taskID: string = req.params.taskid;

//   await AuthExceptionHandlerTemp.Handle(
//     { file: "projects", level: "RESPONSE", logType: "project", service: "project.service" },
//     req,
//     res,
//     () => getTask(userID, projectID, taskID)
//   );
// };