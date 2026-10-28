// Services
import { sendTeamInvitationEmail } from "../mail.service";
import { generateTokenAssets } from "./generateToken.service";
// Repositories
import { UserRepository } from "../../repositories/user.repository";
import { TeamRepository } from "../../repositories/team.repository";
import { InvitationRepository } from "../../repositories/invitation.repository";
// Types
import { role } from "../../types/invitation.type";
import { roles } from "../../types/roles.type";

// Class
const userRepository = new UserRepository();
const teamRepository = new TeamRepository();
const invitationRepository = new InvitationRepository();

// Types
type users = {
  _id: string,
  firstname: string,
  lastname: string,
  username: string,
  email: string,
  country: string,
}[];

const ROLE_LABELS: Record<role, string> = {
  projectManagers: "Project Manager",
  teamLeaders: "Team Leader",
  members: "Member",
};

const getRoleLabel = (role: role): string => ROLE_LABELS[role] ?? "Unknown";


// ─── Core Logic ──────────────────────────────────────────────────────────────
const setInvitations = async (teamTitle: string, teamID: string, inviterId: string, role: role, users: users): Promise<void> => {

  const findById_flDATA: any = await userRepository.findById_fl(inviterId); // ! Bu burada olmasa da olur.
  const fiRoleByTeamID = await invitationRepository.findRoleByTeamID(teamID, role);

  // * Funtion
  const processInvitation = async (index: number) => {

    // Skip if a valid invitation already exists
    const findSameInvForTeamDATA = await invitationRepository.findSameInvForTeam(inviterId, teamID, users[index]._id, role);

    if ((fiRoleByTeamID[role]).includes(users[index]._id)) return;

    if (findSameInvForTeamDATA) {
      if (findSameInvForTeamDATA.status === "pending" && findSameInvForTeamDATA.expiresAt > new Date()) return;
      if (findSameInvForTeamDATA.status === "accepted") return;
    };

    const { token, hashedToken, dateNow, date7 }: { token: string, hashedToken: string, dateNow: Date, date7: Date } = generateTokenAssets();

    // Send Mail
    await invitationRepository.instertInvTeam(
      {
        token: hashedToken,
        type: "team",
        status: "pending",
        invitedBy: inviterId,
        userId: users[index]._id,
        mainResourceId: teamID, // Main source
        secondarySourceId: users[index]._id, // Source to be added
        role: role,
        expiresAt: date7,
        createdAt: dateNow
      });

    sendTeamInvitationEmail({
      to: users[index].email,
      name: `${users[index].firstname} ${users[index].lastname}`,
      inviterName: `${findById_flDATA.firstname} ${findById_flDATA.lastname}`,
      teamTitle: teamTitle,
      role: getRoleLabel(role),
      acceptUrl: `${process.env.URL}/invitation/accept/${token}`, // ! Replace with the front-end URL
      rejectUrl: `${process.env.URL}/invitation/reject/${token}`, // ! Replace with the front-end URL
      lang: users[index].country
    });
  };

  // * FOR?
  for (let index = 0; index <= users.length - 1; index++) await processInvitation(index);
};

// ─── Export ───────────────────────────────────────────────────────────────────
export const sendTeamInvitation = async (teamTitle: string, teamID: string, inviterId: string, role: roles, projectManagers?: users, teamLeaders?: users, members?: users): Promise<void> => {

  if (!role) return;

  if (projectManagers?.length === 0
    && teamLeaders?.length === 0
    && members?.length === 0) return;

  // Role: Owner
  if (role === "owner") {
    if (projectManagers !== undefined) setInvitations(teamTitle, teamID, inviterId, "projectManagers", projectManagers);
    if (teamLeaders !== undefined) setInvitations(teamTitle, teamID, inviterId, "teamLeaders", teamLeaders);
    if (members !== undefined) setInvitations(teamTitle, teamID, inviterId, "members", members);
  };

  //  Role: projectManagers
  if (role === "projectManagers") {
    if (teamLeaders !== undefined) setInvitations(teamTitle, teamID, inviterId, "teamLeaders", teamLeaders);
    if (members !== undefined) setInvitations(teamTitle, teamID, inviterId, "members", members);
  };

  // Role: teamLeaders
  if (role === "teamLeaders") {
    if (members !== undefined) setInvitations(teamTitle, teamID, inviterId, "members", members);
  };

  // Role: members
  if (role === "members") return;
};