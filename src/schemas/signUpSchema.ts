import {z} from 'zod'
//Ye username ka sirf vliadatio  check hai aur z.string() kar paa rahe hai kyuki ye sirf 1 hi value hai
export const usernameValidation=z
    .string()
    .min(2,"Username must be altleast 2 characters")
    .max(20,"Username must be no more 20 characters")
    .regex(/^[a-zA-Z0-9_]+$/,"Username must not contain special character")
//Yha par pura Signup ka Schema ka validation check kar rahe hai yaha par bject banana padega kyuki multiple value
export const signUpSchema=z.object({
    username:usernameValidation,
    email:z.string().email({message:"Invalid Email"}),
    password:z.string().min(8,{message:"Password must be atleast 8 character"})
})    
