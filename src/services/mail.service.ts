import dotenv from 'dotenv';
// Configs
import { gmailTransporter } from '../configs/mailTransporter.config';
// Mail
import { evTemplateSelector, fpTemplateSelector } from "./mail/utils";
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
  // For performance
  const initialPeriod = performance.now();

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