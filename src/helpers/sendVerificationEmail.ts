import { resend } from "@/lib/resend";
import VerificationEmail from "../../emails/verificationEmail";
import { ApiResponse } from "@/types/apiResponse";

export async function sendVerificationEmail(
    email:string,
    username: string,
    verifyCode: string,
): Promise<ApiResponse> {
    try {
        await resend.emails.send({
            from: 'onboarding@resend.dev',
            to: email,
            subject: 'Open Feedback | Verification Code',
            react: VerificationEmail({username, otp: verifyCode}),
        });

        return {
            success: true,
            message: "Verification Email sent successfully"
        }
        
    } catch (emailError) {
        console.error("Error while sending the verification Email", emailError)
        return {
            success: false,
            message: "Failed to send verification email"
        }
    }
}

