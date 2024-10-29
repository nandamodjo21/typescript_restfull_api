import {Request,Response} from "express";
import {Otp_service} from "../service/otp_service";
import {ResponseError} from "../error/response_error";


export class OtpController {
    static async activated(req:Request,res:Response){
        try {
            const otpCode = req.query.otp as string;
            const wa = req.query.wa as string;
            if (!wa) {
                res.status(404).json({status:false,message:"whatsapp not found"});
            }
            await Otp_service.otp(otpCode,wa);
            res.status(200).json({status:true,message:"Otp successfully activated."});
        }catch (e) {
            if (e instanceof ResponseError){
                res.status(e.status).json({ message: e.message });
            }else{
                console.error(e);
                res.status(500).json({ message: "Internal Server Error" });
            }
        }
    }
}