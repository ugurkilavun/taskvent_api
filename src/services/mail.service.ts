import dotenv from 'dotenv';
// Configs
import { gmailTransporter } from '../configs/mailTransporter.config';
// Mail
import { evTemplateSelector, fpTemplateSelector, piTemplateSelector, piaTemplateSelector, pirTemplateSelector, tiTemplateSelector } from "./mail/utils";
// Types
import { mailType } from "../types/mails.type";

// .env config
dotenv.config({ quiet: true });

export const sendVerificationEmail = async ({ to, name, verificationUrl, lang }: { to: string, name: string, verificationUrl: string, lang: string }): Promise<void> => {

  try {
    const { template, subject }: mailType = evTemplateSelector(lang);

    const htmlTemplate: any =
      template.replace("{{name}}", name)
        .replace("{{verificationUrl}}", verificationUrl)
        .replace("{{year}}", new Date().getFullYear().toString())
        .replace("{{appName}}", "Taskvent");

    await gmailTransporter.sendMail({
      from: `Taskvent ${process.env.GMAIL_USER}`,
      to,
      subject,
      html: htmlTemplate,
    });
  } catch (error: any) {
    throw error;
  };
};

export const sendPasswordResetLink = async ({ to, name, resetUrl, lang }: { to: string, name: string, resetUrl: string, lang: string }): Promise<void> => {

  try {
    const { template, subject }: mailType = fpTemplateSelector(lang);

    const htmlTemplate: any =
      template.replace("{{name}}", name)
        .replace("{{resetUrl}}", resetUrl)
        .replace("{{year}}", new Date().getFullYear().toString())
        .replace("{{appName}}", "Taskvent");

    await gmailTransporter.sendMail({
      from: `Taskvent ${process.env.GMAIL_USER}`,
      to,
      subject,
      html: htmlTemplate,
    });
  } catch (error: any) {
    throw error;
  };
};

export const sendProjectInvitationEmail = async ({ to, name, inviterName, teamName, projectTitle, acceptUrl, rejectUrl, lang }:
  { to: string, name: string, inviterName: string, teamName: string, projectTitle: string, acceptUrl: string, rejectUrl: string, lang: string }): Promise<void> => {

  try {
    const { template, subject }: mailType = piTemplateSelector(lang);

    const htmlTemplate: any =
      template.replace("{{name}}", name)
        .replace("{{inviterName}}", inviterName)
        .replace("{{teamName}}", teamName)
        .replace("{{projectTitle}}", projectTitle)
        .replace("{{acceptUrl}}", acceptUrl)
        .replace("{{rejectUrl}}", rejectUrl)
        .replace("{{year}}", new Date().getFullYear().toString())
        .replace("{{appName}}", "Taskvent");

    await gmailTransporter.sendMail({
      from: `Taskvent ${process.env.GMAIL_USER}`,
      to,
      subject,
      html: htmlTemplate,
    });
  } catch (error: any) {
    throw error;
  };
};

// Project
export const sendProjectAcceptEmail = async ({ to, inviterName, teamName, projectTitle, lang }:
  { to: string, inviterName: string, teamName: string, projectTitle: string, lang: string }): Promise<void> => {

  try {
    const { template, subject }: mailType = piaTemplateSelector(lang);

    const htmlTemplate: any =
      template.replace("{{inviterName}}", inviterName)
        .replace("{{teamName}}", teamName)
        .replace("{{projectTitle}}", projectTitle)
        .replace("{{year}}", new Date().getFullYear().toString())
        .replace("{{appName}}", "Taskvent");

    await gmailTransporter.sendMail({
      from: `Taskvent ${process.env.GMAIL_USER}`,
      to,
      subject,
      html: htmlTemplate,
    });
  } catch (error: any) {
    throw error;
  };
};

export const sendProjectRejectEmail = async ({ to, inviterName, teamName, projectTitle, lang }:
  { to: string, inviterName: string, teamName: string, projectTitle: string, lang: string }): Promise<void> => {

  try {
    const { template, subject }: mailType = pirTemplateSelector(lang);

    const htmlTemplate: any =
      template.replace("{{inviterName}}", inviterName)
        .replace("{{teamName}}", teamName)
        .replace("{{projectTitle}}", projectTitle)
        .replace("{{year}}", new Date().getFullYear().toString())
        .replace("{{appName}}", "Taskvent");

    await gmailTransporter.sendMail({
      from: `Taskvent ${process.env.GMAIL_USER}`,
      to,
      subject,
      html: htmlTemplate,
    });
  } catch (error: any) {
    throw error;
  };
};

// Teams
export const sendTeamInvitationEmail = async ({ to, name, inviterName, teamTitle, role, acceptUrl, rejectUrl, lang }:
  { to: string, name: string, inviterName: string, teamTitle: string, role: string, acceptUrl: string, rejectUrl: string, lang: string }): Promise<void> => {

  try {
    const { template, subject }: mailType = tiTemplateSelector(lang);

    const htmlTemplate: any =
      template.replace("{{name}}", name)
        .replace("{{inviterName}}", inviterName)
        .replace("{{teamTitle}}", teamTitle)
        .replace("{{role}}", role)
        .replace("{{acceptUrl}}", acceptUrl)
        .replace("{{rejectUrl}}", rejectUrl)
        .replace("{{year}}", new Date().getFullYear().toString())
        .replace("{{appName}}", "Taskvent");

    await gmailTransporter.sendMail({
      from: `Taskvent ${process.env.GMAIL_USER}`,
      to,
      subject,
      html: htmlTemplate,
    });
  } catch (error: any) {
    throw error;
  };
};

// export const sendTeamRejectEmail = async ({ to, inviterName, teamName, lang }:
//   { to: string, inviterName: string, teamName: string, lang: string }): Promise<void> => {

//   try {
//     const { template, subject }: mailType = pirTemplateSelector(lang);

//     const htmlTemplate: any =
//       template.replace("{{inviterName}}", inviterName)
//         .replace("{{teamName}}", teamName)
//         .replace("{{year}}", new Date().getFullYear().toString())
//         .replace("{{appName}}", "Taskvent");

//     await gmailTransporter.sendMail({
//       from: `Taskvent ${process.env.GMAIL_USER}`,
//       to,
//       subject,
//       html: htmlTemplate,
//     });
//   } catch (error: any) {
//     throw error;
//   };
// };