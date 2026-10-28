// Utils
import { statusCodeErrors } from "../utils/customErrors.util";
import { URLToken } from "../utils/urlTokens.util";
// Types
import { defaultResponseType } from "../types/responses.type";
// Repositories
import { InvitationRepository } from "../repositories/invitation.repository";
import { UserRepository } from "../repositories/user.repository";
import { ProjectRepository } from "../repositories/project.repository";
import { TeamRepository } from "../repositories/team.repository";
// Services
import { sendProjectAcceptEmail, sendProjectRejectEmail } from "../services/mail.service";

// Class
const invitationRepository = new InvitationRepository();
const urlToken = new URLToken();
const userRepository = new UserRepository();
const projectRepository = new ProjectRepository();
const teamRepository = new TeamRepository();

export const acceptInvitationService = async (token: string): Promise<defaultResponseType> => {

  const hashedToken = urlToken.hash(token);
  const findInvByTokenDATA: any = await invitationRepository.findInvByToken(hashedToken);

  if (!findInvByTokenDATA) throw new statusCodeErrors("Invalid or expired token.", 400);
  // ! Minor bug:
  if (findInvByTokenDATA.status !== "pending") throw new statusCodeErrors("Token used or expired.", 400);
  if (findInvByTokenDATA.expiresAt < Date.now()) {
    await invitationRepository.updateByTokenInvStatus(hashedToken, "expired");
    throw new statusCodeErrors("Expired token.", 400)
  };

  // Source types
  if (findInvByTokenDATA.type === "project") {

    // Team add
    const upProjectsTeam = await invitationRepository.updateProjectsTeam((findInvByTokenDATA.mainResourceId).toString(), (findInvByTokenDATA.secondarySourceId).toString());
    if (!upProjectsTeam) throw new statusCodeErrors("Team Update error.", 400);

    // Invitation update
    const upByTokenInvStatus = await invitationRepository.updateByTokenInvStatus(hashedToken, "accepted");
    if (!upByTokenInvStatus) throw new statusCodeErrors("Invitation Update error.", 400);

    const findEverythingByIDDATA = await userRepository.findEverythingByID(findInvByTokenDATA.invitedBy);
    const projectRepositoryDATA = await projectRepository.findProjectNameByID(findInvByTokenDATA.mainResourceId);
    const findTeamNameByTeamIDDATA = await teamRepository.findTeamNameByTeamID(findInvByTokenDATA.secondarySourceId);

    // Send mail
    sendProjectAcceptEmail({
      to: findEverythingByIDDATA.email,
      inviterName: `${findEverythingByIDDATA.firstname} ${findEverythingByIDDATA.lastname}`,
      teamName: findTeamNameByTeamIDDATA.title,
      projectTitle: projectRepositoryDATA.title,
      lang: findEverythingByIDDATA.country
    });

  };

  return {
    message: "Invitation accepted.",
    statusCode: 200
  };

};

export const rejectInvitationService = async (token: string): Promise<defaultResponseType> => {

  const hashedToken = urlToken.hash(token);
  const findInvByTokenDATA: any = await invitationRepository.findInvByToken(hashedToken);

  if (!findInvByTokenDATA) throw new statusCodeErrors("Invalid or expired token.", 400);
  if (findInvByTokenDATA.status !== "pending") throw new statusCodeErrors("Token used or expired.", 400);
  if (findInvByTokenDATA.expiresAt < Date.now()) {
    await invitationRepository.updateByTokenInvStatus(hashedToken, "expired");
    throw new statusCodeErrors("Expired token.", 400)
  };

  const upByTokenInvStatus = await invitationRepository.updateByTokenInvStatus(hashedToken, "rejected");
  if (!upByTokenInvStatus) throw new statusCodeErrors("Invitation Update error.", 400);

  // Source types
  if (findInvByTokenDATA.type === "project") {
    const findEverythingByIDDATA = await userRepository.findEverythingByID(findInvByTokenDATA.invitedBy);
    const projectRepositoryDATA = await projectRepository.findProjectNameByID(findInvByTokenDATA.mainResourceId);
    const findTeamNameByTeamIDDATA = await teamRepository.findTeamNameByTeamID(findInvByTokenDATA.secondarySourceId);

    // Send mail
    sendProjectRejectEmail({
      to: findEverythingByIDDATA.email,
      inviterName: `${findEverythingByIDDATA.firstname} ${findEverythingByIDDATA.lastname}`,
      teamName: findTeamNameByTeamIDDATA.title,
      projectTitle: projectRepositoryDATA.title,
      lang: findEverythingByIDDATA.country
    });
  };

  return {
    message: "Invitation rejected.",
    statusCode: 200
  };

};