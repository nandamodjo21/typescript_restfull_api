import {Request,Response} from "express";
import {Activation_service} from "../service/activation_service";

export class ActivationController {
    static async activate(req:Request, res:Response){
        try {
            const email = req.query.email as string;
            if (!email){
                res.status(401).json({status:false,message:"email not found"});
            }
            await Activation_service.activate(email);
            res.status(200).send("your account has been activated. please back to your apps!");
        }catch (e) {
            res.status(500).send({error: e});
        }
    }
}