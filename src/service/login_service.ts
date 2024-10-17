import {LoginRequest, LoginResponse, toLoginResponse} from "../models/login";
import {Validation} from "../validation/validation";
import {AuthValidation} from "../validation/auth_validation";
import conn from "../config/db";
import {ResponseError} from "../error/response_error";
import bcrypt from 'bcrypt'

export  class LoginService {

    static async login(req: LoginRequest): Promise<LoginResponse|null> {

         const loginRequest = Validation.validate(AuthValidation.LOGIN,req);

         const [rows] = await conn.promise().query(`SELECT kd_user,name,username,email,password,created_at FROM users WHERE email = "${loginRequest.email}"`);
         const  result = rows as any[];
         if (result.length >0){
             const user = result[0];
             const isValidPass = await bcrypt.compare(loginRequest.password,user.password);
             if (isValidPass){
                 console.log(user);
                 return toLoginResponse(user);
             }else{
                 throw new ResponseError(401,"Unauthorized");
             }
         }else{
             throw new ResponseError(404,"user not found");
         }
    }
}