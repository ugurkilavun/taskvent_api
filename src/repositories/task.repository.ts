// Models
import task from "../models/task.model";
// Types
import { taskType } from "../types/task.type";

export class TaskRepository {

  public async insertTask(DATA: taskType): Promise<any> {
    return await task.insertOne({
      projectID: DATA.projectID,
      description: DATA.description,
      startDate: DATA.startDate,
      endDate: DATA.endDate,
      priority: DATA.priority,
      members: DATA.members,
      status: DATA.status,
    });
  };

  public async findTaskByUserID(projectID: string, members: [string]): Promise<any> {
    return await task.find({
      projectID: projectID,
      members: { $in: members }
    }, {
      projectID: 0
    });
  };

  public async findTaskForRoot(projectID: string): Promise<any> {
    return await task.find({
      projectID: projectID
    });
  };

  public async findTaskByID(taskID: string): Promise<any> {
    return await task.find({
      _id: taskID
    });
  };
};