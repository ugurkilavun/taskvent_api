// ? Projects, Teams, Tasks
export type projectType = {
  owner: string,
  teamID: Array<string>,
  title: string,
  description: string,
  tags: Array<string>,
  createdAt: Date
};

// Task
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

// Team
export type teamsType = {
  teamID: string;
  title: string;
  description: string;
  owner: taskMemberType;
  projectManagers?: taskMemberType;
  teamLeaders?: taskMemberType;
  members?: taskMemberType;
}[];

// Project
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

// ? Auths
export type authResponseType = {
  message: string;
  statusCode: number;
  accessToken?: string;
  refreshToken?: string;
};

export type authAvailabilityType = {
  message: string,
  statusCode: number,
  available: boolean,
};

// ? /==*==\ Response types /==*==\
// Default response type
export type defaultResponseType = {
  message: string;
  statusCode: number;
  data?: Array<object>;
};