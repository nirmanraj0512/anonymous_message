//yaha par humkofg existing data type ko modify karege next AUth ka ye isliey kyuki option me user s enext auth kuch nikalne snhi d e raha ahai
import 'next-auth'
import { DefaultSession } from 'next-auth';
declare module 'next-auth'{
    interface User{
        _id?:string;
        isVerified?:boolean;
        isAcceptingMessages?:boolean;
        username?:string
    }
    interface Session{
        user:{
            _id?:string;
            isVerified?:boolean;
            isAcceptingMessages?:boolean;
            username?:string
        }&DefaultSession['user']
    }
}
///Ye bhi ek tarika hai
declare module 'next-auth/jwt'{
    interface JWT{
        _id?:string;
        isVerified?:boolean;
        isAcceptingMessages?:boolean;
        username?:string
    }
}