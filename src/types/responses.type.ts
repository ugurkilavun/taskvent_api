


export type authResponseType1 = {
  response: {
    message: string;
    access_token?: string;
    refresh_token?: string;
    projectDatas?: {
      project?: {
        projectID: string;
        title: string;
        description: string;
        tags: [string];
        createdAt: Date;
      },
      tasks?: tasksType;
    },
    projects?: projectsType,
  };
  userId: string;
  HTTPStatusCode: number;
};
// !00000000000000000000000000000000000000000

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

export type teamsType = {
  teamID: string;
  title: string;
  description: string;
  owner: taskMemberType;
  projectManagers?: taskMemberType;
  teamLeaders?: taskMemberType;
  members?: taskMemberType;
}[];

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

export type projectResponseType = {
  message: string;
  projects?: projectsType,
  HTTPStatusCode: number;
};

export type authResponseType = {
  message: string;
  accessToken?: string;
  refreshToken?: string;
  HTTPStatusCode: number;
};
// export type newauthResponseType = {}