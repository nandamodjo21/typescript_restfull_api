import {LoginRequest, LoginResponse, toLoginResponse} from "../models/login";
import {Validation} from "../validation/validation";
import {AuthValidation} from "../validation/auth_validation";
import conn from "../config/db";
import {ResponseError} from "../error/response_error";
import bcrypt from 'bcrypt'

export  class LoginService {

    static async login(req: LoginRequest): Promise<LoginResponse|null> {

         const loginRequest = Validation.validate(AuthValidation.LOGIN,req);

         try {
             const [rows] = await conn.promise().query(`SELECT * FROM users WHERE email = "${loginRequest.email}"`);
             const  result = rows as any[];
             console.log(`result: ${result}`);
             if (result.length >0){
                 const user = result[0];
                 console.log(`users ${user}`);
                 const isValidPass = await bcrypt.compare(loginRequest.password,user.password);
                 const isActive = user.active;
                 if (isValidPass){
                     if (isActive === 'ACTIVE'){
                         return toLoginResponse(user);
                     }else{
                         throw new ResponseError(401,`Please Activation your account`)
                     }
                 }else{
                     throw new ResponseError(401,"Unauthorized");
                 }
             }else{
                 throw new ResponseError(404,"user not found");
             }
         }catch (e) {
             throw new ResponseError(500,'Internal Server Error');
         }
    }
}