import {resend} from "@/lib/resend"
import VerificationEmail from "../../emails/VerificationEmail"
import { ApiResponse } from "@/types/ApiResponse"

export async function sendVerificationEmail(
    email:string,
    username:string,
    verifyCode:string
):Promise<ApiResponse>{   //Yaha par type safety provide kar rha ehai Promise par jo humoog baye hia ApiResponse typoe me se 
    try{
        await resend.emails.send({
            from:'me@example.com',
            to:email,
            subject:'Anonymous Message Verification Code',
            react:VerificationEmail({username,otp:verifyCode}),
        });
        return {success:true,message:"Verification Email sent successfully"}
    }
    catch(emailError){
        console.error("Error sending verification email",emailError)
        return {success:false,message:"Failed to send verification Email"}
    }
}