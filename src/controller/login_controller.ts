import {Request,Response,NextFunction} from "express";
import {LoginService} from "../service/login_service";
import {ResponseError} from "../error/response_error";

export class LoginController {
    static async login(req:Request, res:Response,next:NextFunction):Promise<void> {
        try{
            const loginResponse = await LoginService.login(req.body);
            if (loginResponse){
                res.status(200).json({status:true,message:"login ok",data:loginResponse});
            }else{
                res.status(401).json({status:false,message:"login failed",data:[]});
            }
        }catch (e) {
            console.log(e);
            if (e instanceof ResponseError){
                res.status(e.status).json({ message: e.message });
            }else{
                console.error(e);
                res.status(500).json({ message: "Internal Server Error" });
            }
        }
    }
}