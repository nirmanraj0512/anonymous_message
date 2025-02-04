import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import bcrypt from 'bcryptjs';

import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";
export async function POST(request:Request){
    await dbConnect()
    try{
        const {username,email,password}=await request.json()
        //yaha par check karna hai ki koi hai existing user jo ye wala username lene wala hai isverified hai ki wahi dekhna hai
        const existingUserVerifiedByUsername=await UserModel.findOne({
            username,
            isVerified:true
        })
        if(existingUserVerifiedByUsername){
            return Response.json({
                success:false,
                message:"Username already taken"
            },{status:400})
        }
        //Existing user by email chenck kar rahe hai
        //Await lagana padega nhi to humesh atrue dega ye yaha par wo wlaa ayega jo ki registerd hai lekin vefifed nhi hai
        const existingUserByEmail=await UserModel.findOne({email})
        //Verify code banaye hai
        const verifyCode=Math.floor(100000+Math.random()*900000).toString()
        //Agar apko mil gaya wo user
        if(existingUserByEmail){
            //Agar mil gya verifeid user tab yhe karege 
            if(existingUserByEmail.isVerified){
                return Response.json({
                    success:false,
                    message:"User already Exist with this email"
                },{status:400})
            }
            else{
                //Yha par ki existing user hai lekin verified nhi hai to phir se naya password banega  verification email bhi bhejna hai 
                const hashedPassword=await bcrypt.hash(password,10)
                existingUserByEmail.password=hashedPassword;
                existingUserByEmail.verifyCode=verifyCode;
                existingUserByEmail.verifyCodeExpiry=new Date(Date.now()+3600000)
                await existingUserByEmail.save()
            }
        }
        //Agar user nhi mila ahi to register karo as a new user
        else{
            const hasedPassword=await bcrypt.hash(password,10)
            console.log("Crypted Password",hasedPassword);
            const expiryDate=new Date()
            expiryDate.setHours(expiryDate.getHours()+1)

            const newUser=new UserModel({
                username,
                email,
                password:hasedPassword,
                verifyCode,
                verifyCodeExpiry:expiryDate,
                isVerified:false,
                isAcceptingMessage:true,
                message:[]
            })

            await newUser.save()
        }
        //KAbhi kabhi existing user ke case me bhi bhete hai na verify code to make it verifred user islye yaha par likh rha hai

        //Send Verification Email
        const emailResponse=await sendVerificationEmail(email,
        username,
        verifyCode
        )
        //documentation padhoge tab pta chaleg ki ata ky ahi response me console.log se pat chal sakta hai
        if(!emailResponse.success){
            return Response.json({
                success:false,
                message:emailResponse.message
            },{status:500})
        }
        return Response.json({
            success:true,
            message:"User registered successfully.Please verify your email"
        },{status:201}) 

    }
    catch(error){
        console.log("Error registering user",error)
        return Response.json(
            {
                success:false,
                message:"Error registering user"
            },
            {
                status:500
            }
        )
    }
}