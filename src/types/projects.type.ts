export type projectType = {
  owner: string,
  teamID: Array<string>,
  title: string,
  description: string,
  tags: Array<string>,
  createdAt: Date
};

// Tasks
export type taskMemberType = {
  firstname: string;
  lastname: string;
  username: string;
}[];

export type tasksType = {
  taskID: string;
  description: string;
  startDate: any;
  endDate: any;
  priority: string;
  members: taskMemberType;
  status: string;
}[];

// Teams
export type teamsType = {
  teamID: string;
  title: string;
  description: string;
  owner: taskMemberType;
  projectManagers?: taskMemberType;
  teamLeaders?: taskMemberType;
  members?: taskMemberType;
}[];

// Projects
export type projectsType = {
  projectID: string;
  title: string;
  description: string;
  tags: [string];
  createdAt: Date;
  tasks?: tasksType;
  teams?: teamsType;
  owned: boolean;
}[];