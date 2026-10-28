export type teamType = {
  _id?:string,
  title: string,
  description: string,
  owner: string,
  projectManagers?: Array<string>,
  teamLeaders?: Array<string>,
  members?: Array<string>,
  createdAt: Date,
};