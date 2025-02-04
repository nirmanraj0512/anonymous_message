import { NextAuthOptions } from "next-auth";
import  CredentialsProvider  from "next-auth/providers/credentials";//TypeScript me {} nhi hota hai
import bcrypt from "bcryptjs"
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";

export const authOptions:NextAuthOptions={
    providers:[
        CredentialsProvider({
            id: "credentials",
            name: "Credentials",
            credentials:{
                username: { label: "Email", type: "text" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials:any):Promise<any>{
                await dbConnect()
                try{
                    const user=await UserModel.findOne({
                        //Agar man lo humko ye fututreproof banana hai ya to username se login kar skate hai ya phir email se
                        $or:[                            {email:credentials.identifier},
                            {username:credentials.identifier}
                        ]
                    })
                    if(!user){
                        throw new Error('No user found with this email')
                    }
                    if(user.isVerified){
                        throw new Error("Please verify your account before login")
                    }
                    const isPasswordCorrect=await bcrypt.compare(credentials.password,user.password)
                    if(isPasswordCorrect){
                        return user
                        //iske baad pura ka pura control hhumlog providers ko
                    }
                    else{
                        throw new Error("Incorrect Password ")
                    }
                }
                catch(err:any){
                    throw new Error(err)
                }
            }
        })
    ],
    callbacks:{
          async jwt({ token, user}) {
            if(user){
                //Humlog existing datatype ko update karna padega islye types me naya folder banye hai next-auth.d.ts

                //token ke pass kuch nhi hota  normallly bas user id lelin humlog usko aur powerful bana diye hai taki sara value isme store kar sake aur jab  bhi chahe nikal le
                token._id=user.id?.toString()
                token.isVerified=user.isVerified;
                token.isAcceptingMessages=user.isAcceptingMessages;
                token.username=user.username
            }
            return token
          },
          async session({ session, token }) {
            if(token){
                session.user._id=token._id
                session.user.isVerified=token.isVerified
                session.user.isAcceptingMessages=token.isAcceptingMessages
                session.user.username=token.username
            }
            return session
          },
    },
    pages:{
        signIn:'/sign-in'
    },
    session:{
        strategy:"jwt"
    },
    secret:process.env.NEXTAUTH_SECRET,
}