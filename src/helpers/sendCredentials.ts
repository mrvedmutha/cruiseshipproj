import { nodemailerTransporter } from "@/lib/nodemailer";
import SendCredentialEmail from "../../emails/sendCredentialEmail";
import { render } from "@react-email/components";
import { ApiResponse } from "@/types/ApiResponses";

export async function sendCredentials(
  name: string,
  email: string,
  password: string
) {
  try {
    const mail = await render(SendCredentialEmail({ name, email, password }));
    const options = {
      from: process.env.ADMIN_EMAIL,
      to: email,
      subject: "Your Credentials",
      html: mail,
    };
    await nodemailerTransporter.sendMail(options);
    return (
      {
        success: true,
        message: "Email sent successfully",
      } as ApiResponse,
      { status: 200 }
    );
  } catch (error) {
    console.error("Error sending email: ", error);
    return (
      {
        success: false,
        message: "Error sending email",
      } as ApiResponse,
      { status: 500 }
    );
  }
}
