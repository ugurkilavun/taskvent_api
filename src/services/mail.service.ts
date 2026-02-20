import dotenv from 'dotenv';
// Configs
import { gmailTransporter } from '../configs/mailTransporter.config';
// Mail
import { evTemplateSelector, fpTemplateSelector } from "./mail/utils";
// Types
import { mailType } from "../types/mails.type";
// Middlewares
import { Logger } from "../middlewares/logger.middleware";

// .env config
dotenv.config({ quiet: true });

export const sendVerificationEmail = async ({ to, name, verificationUrl, lang }: { to: string, name: string, verificationUrl: string, lang: string }): Promise<void> => {
  // For performance
  const initialPeriod = performance.now();

  // Logger
  const logger = new Logger();

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
    // Logger - RESPONSE
    logger.create({
      timestamp: new Date(),
      level: "AUDIT",
      logType: "verification mail",
      message: `Verification mail sent to ${to}`,
      service: "mail.service",
      username: name,
      durationMs: performance.now() - initialPeriod,
    }, { file: "mails", seeLogConsole: true });
  } catch (error: any) {
    // Logger - RESPONSE
    logger.create({
      timestamp: new Date(),
      level: "AUDIT",
      logType: "verification mail",
      message: `Verification mail could not be sent: ${to}`,
      service: "mail.service",
      username: name,
      durationMs: performance.now() - initialPeriod,
      details: {
        error: "MAILERROR",
        stack: `Error: ${error.stack}`
      }
    }, { file: "mails", seeLogConsole: true });
    throw error;
  };
};

export const sendPasswordResetLink = async ({ to, name, resetUrl, lang }: { to: string, name: string, resetUrl: string, lang: string }): Promise<void> => {
  // For performance
  const initialPeriod = performance.now();

  // Logger
  const logger = new Logger();

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
    // Logger - RESPONSE
    logger.create({
      timestamp: new Date(),
      level: "AUDIT",
      logType: "password reset mail",
      message: `Password reset mail sent to ${to}`,
      service: "mail.service",
      username: name,
      durationMs: performance.now() - initialPeriod,
    }, { file: "mails", seeLogConsole: true });
  } catch (error: any) {
    // Logger - RESPONSE
    logger.create({
      timestamp: new Date(),
      level: "AUDIT",
      logType: "Password reset mail",
      message: `Password reset mail could not be sent: ${to}`,
      service: "mail.service",
      username: name,
      durationMs: performance.now() - initialPeriod,
      details: {
        error: "MAILERROR",
        stack: `Error: ${error.stack}`
      }
    }, { file: "mails", seeLogConsole: true });
    throw error;
  };
};