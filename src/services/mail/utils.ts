// Templates
// EN
import { emailVerificationTemplate_en } from "./templates/en/ev.template.en";
import { forgotPasswordTemplate_en } from "./templates/en/fp.template.en";
import { projectInviteTemplate_en } from "./templates/en/pi.template.en";
import { projectInviteAcceptedTemplate_en } from "./templates/en/pia.template.en";
import { projectInviteRejectedTemplate_en } from "./templates/en/pir.template.en";
import { teamInviteTemplate_en } from "./templates/en/ti.template.en";

// TR
import { emailVerificationTemplate_tr } from "./templates/tr/ev.template.tr";
import { forgotPasswordTemplate_tr } from "./templates/tr/fp.template.tr";
import { projectInviteTemplate_tr } from "./templates/tr/pi.template.tr";
import { projectInviteAcceptedTemplate_tr } from "./templates/tr/pia.template.tr";
import { projectInviteRejectedTemplate_tr } from "./templates/tr/pir.template.tr";
import { teamInviteTemplate_tr } from "./templates/tr/ti.template.tr";
// Types
import { mailType } from "../../types/mails.type";

// * Email Verification Template Selector
export const evTemplateSelector = (lang: string): mailType => {
  switch (lang) {
    case "US":
      return { template: emailVerificationTemplate_en, subject: "Email Verification" };

    case "TR":
      return { template: emailVerificationTemplate_tr, subject: "E-posta Doğrulama" };

    default:
      return { template: emailVerificationTemplate_en, subject: "Email Verification" };
  };
};

// * Forgot Password Template Selector
export const fpTemplateSelector = (lang: string): mailType => {
  switch (lang) {
    case "US":
      return { template: forgotPasswordTemplate_en, subject: "Password reset" };

    case "TR":
      return { template: forgotPasswordTemplate_tr, subject: "Şifre Sıfırlama" };

    default:
      return { template: forgotPasswordTemplate_en, subject: "Reset password" };
  };
};

// * Project Invitation Template Selector
export const piTemplateSelector = (lang: string): mailType => {
  switch (lang) {
    case "US":
      return { template: projectInviteTemplate_en, subject: "Project Invitation" };

    case "TR":
      return { template: projectInviteTemplate_tr, subject: "Proje Daveti" };

    default:
      return { template: projectInviteTemplate_en, subject: "Project Invitation" };
  };
};

// * Project Invitation Accept Template Selector
export const piaTemplateSelector = (lang: string): mailType => {
  switch (lang) {
    case "US":
      return { template: projectInviteAcceptedTemplate_en, subject: "Invitation Accepted" };

    case "TR":
      return { template: projectInviteAcceptedTemplate_tr, subject: "Davet Kabul Edildi" };

    default:
      return { template: projectInviteAcceptedTemplate_en, subject: "Invitation Accepted" };
  };
};

// * Project Invitation Reject Template Selector
export const pirTemplateSelector = (lang: string): mailType => {
  switch (lang) {
    case "US":
      return { template: projectInviteRejectedTemplate_en, subject: "Invitation Declined" };

    case "TR":
      return { template: projectInviteRejectedTemplate_tr, subject: "Davet Reddedildi" };

    default:
      return { template: projectInviteRejectedTemplate_en, subject: "Invitation Declined" };
  };
};

// * Team Invitation Template Selector
export const tiTemplateSelector = (lang: string): mailType => {
  switch (lang) {
    case "US":
      return { template: teamInviteTemplate_en, subject: "Team Invitation" };

    case "TR":
      return { template: teamInviteTemplate_tr, subject: "Takım Daveti" };

    default:
      return { template: teamInviteTemplate_en, subject: "Team Invitation" };
  };
};
