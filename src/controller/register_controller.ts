import {Request,Response,NextFunction} from "express";
import {RegisterService} from "../service/register_service";
import {ResponseError} from "../error/response_error";

export class RegisterController {
    static async register(req:Request,res:Response,next:NextFunction){
        try{
            await RegisterService.register(req.body);
            res.status(200).json({status:true,message:"Register successfully"});
        }catch (error) {
            if (error instanceof ResponseError) {
                res.status(error.status).json({ message: error.message });
            } else {
                console.error(error);
                res.status(500).json({ message: "Internal Server Error" });
            }
        }
    }
}