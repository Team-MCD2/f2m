import { sendMail } from "@/lib/email/send-mail";

export type { SendMailResult as SendEmailResult } from "@/lib/email/send-mail";

export async function sendRelanceEmail(to: string, subject: string, htmlBody: string) {
  return sendMail(to, subject, htmlBody);
}

export { relanceEmailHtml } from "@/lib/email/templates";
