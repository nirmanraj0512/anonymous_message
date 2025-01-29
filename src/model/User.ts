import mongoose,{Schema,Document} from "mongoose";

//We specify the type of our in message data 
export interface Message extends Document{
    content:string;
    createdAt:Date
}
//We specify the Structure  of our message in message schema 

//We provide typeSafety by using ""Schema<Message>"" if we directly want to declare the data type sadfety we can also write ""String"" but here it is like a object and we makd it so we will give Message
//Ye moongoose ka hai schema 
const MessageSchema: Schema<Message>=new Schema({
    content:{
        type:String,//Lekin moongose me ""String"" aur typeScript me ""string "" LOWERCASE
        required:true
    },
    createdAt:{
        type:Date,
        required:true,
        default:Date.now
    }
})


//Yaha par hum specify kartre hai ki user me kya rahega 
export interface User extends Document{
    username:string;//TypeScript me ""string"" sab small me
    email:string;
    password:string;
    verifyCode:string;
    verifyCodeExpiry:Date;
    isVerified:boolean;
    isAcceptingMessage:boolean;
    messages:Message[]
}
//YE USerka Schema for MOOngose.
const UserSchema: Schema<User>=new Schema({
    username:{
        type:String,//Lekin moongose me ""String"" 
        required:[true,"Username is required"],
        trim:true,
        unique:true
    },
    email:{
        type:String,
        required:[true,"Email is required"],
        unique:true,
        match:[/.+\@.+\..+/,'Please use a valid email address']
    },
    password:{
        type:String,
        required:[true,"Password is required"],
    },
    verifyCode:{
        type:String,
        required:[true,"Verify Code is required"],
    },
    verifyCodeExpiry:{
        type:Date,
        required:[true,"Verify Code Expiry is required"],
    },
    isVerified:{
        type:Boolean,
        default:false
    },
    isAcceptingMessage:{
        type:Boolean,
        default:true
    },
    messages:[MessageSchema]
    
})


const UserModel=(mongoose.models.User as mongoose.Model<User>)||(mongoose.model<User>("User",UserSchema))

export default UserModel;

