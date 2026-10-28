// Services
import { sendProjectInvitationEmail } from "../mail.service";
// Repositories
import { UserRepository } from "../../repositories/user.repository";
import { TeamRepository } from "../../repositories/team.repository";
import { InvitationRepository } from "../../repositories/invitation.repository";
// Utils
import { URLToken } from "../../utils/urlTokens.util";

// Class
const userRepository = new UserRepository();
const teamRepository = new TeamRepository();
const invitationRepository = new InvitationRepository();
const urlToken = new URLToken();

// Types
type invitationType = {
  invitedBy: string;
  userId: string;
  mainResourceId: string;
  secondarySourceId: string;
};

type invitationEmailType = {
  to: string;
  name: string;
  inviterName: string;
  teamName: string;
  projectTitle: string;
  lang: string;
};

const setInvitations = async (invitation: invitationType, invitationEmail: invitationEmailType) => {

  // * Generate Token
  const token: string = urlToken.generate();
  const hashedToken = urlToken.hash(token);
  // Date
  const dateNow: any = new Date();
  const date7: any = new Date();
  date7.setDate(dateNow.getDate() + 7);

  await invitationRepository.instertInvProject(
    {
      token: hashedToken,
      type: "project",
      status: "pending",
      invitedBy: invitation.invitedBy,
      userId: invitation.userId,
      mainResourceId: invitation.mainResourceId, // Main source
      secondarySourceId: invitation.secondarySourceId, // Source to be added
      expiresAt: date7,
      createdAt: dateNow

    });

  sendProjectInvitationEmail({
    to: invitationEmail.to,
    name: invitationEmail.name,
    inviterName: invitationEmail.inviterName,
    teamName: invitationEmail.teamName,
    projectTitle: invitationEmail.projectTitle,
    acceptUrl: `${process.env.URL}/invitation/accept/${token}`, // ! Replace with the front-end URL
    rejectUrl: `${process.env.URL}/invitation/reject/${token}`, // ! Replace with the front-end URL
    lang: invitationEmail.lang
  });
}

// Main service
export const sendProjectInvitation = async (projectTitle: string, projectID: string, inviterId: string, teams: string[]): Promise<void> => {

  if (teams.length === 0) return;

  const fiTeamByTeamIDQuery: any = await teamRepository.findTeamByTeamID(teams);

  for (let index = 0; index <= fiTeamByTeamIDQuery.length - 1; index++) {

    const findByIdDATA: any = await userRepository.findEverythingByID(fiTeamByTeamIDQuery[index].owner);
    const findById_fluDATA: any = await userRepository.findById_flu([inviterId]);

    const findSameInvForProjectDATA = await invitationRepository.findSameInvForProject(findByIdDATA._id, projectID, fiTeamByTeamIDQuery[index]._id);

    if (!findSameInvForProjectDATA) {

      // Send Mail
      await setInvitations({
        invitedBy: inviterId,
        userId: findByIdDATA._id,
        mainResourceId: projectID,
        secondarySourceId: fiTeamByTeamIDQuery[index]._id
      }, {
        to: findByIdDATA.email,
        name: `${findByIdDATA.firstname} ${findByIdDATA.lastname}`,
        inviterName: `${findById_fluDATA[0].firstname} ${findById_fluDATA[0].lastname}`,
        teamName: fiTeamByTeamIDQuery[index].title,
        projectTitle: projectTitle,
        lang: findByIdDATA.country
      });

    } else {
      if (findSameInvForProjectDATA.status === "rejected" || findSameInvForProjectDATA.status === "expired" || findSameInvForProjectDATA.expiresAt < new Date()) {

        // Send Mail
        await setInvitations({
          invitedBy: inviterId,
          userId: findByIdDATA._id,
          mainResourceId: projectID,
          secondarySourceId: fiTeamByTeamIDQuery[index]._id
        }, {
          to: findByIdDATA.email,
          name: `${findByIdDATA.firstname} ${findByIdDATA.lastname}`,
          inviterName: `${findById_fluDATA[0].firstname} ${findById_fluDATA[0].lastname}`,
          teamName: fiTeamByTeamIDQuery[index].title,
          projectTitle: projectTitle,
          lang: findByIdDATA.country
        });
      };
    };

  };
};