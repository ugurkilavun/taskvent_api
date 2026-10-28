export type role = "projectManagers" | "teamLeaders" | "members";

export type invitationType = {
  token: string,
  type: "project" | "team",
  status: "pending" | "accepted" | "rejected" | "expired",
  invitedBy: string,
  userId: string,
  mainResourceId: string,
  secondarySourceId: string,
  role?: role,
  expiresAt: Date,
  createdAt: Date,
};