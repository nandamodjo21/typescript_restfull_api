import { Router,Request,Response } from "express";
import { UserController } from "../controller/user_controller";
import {LoginController} from "../controller/login_controller";
import {RegisterService} from "../service/register_service";
import {RegisterController} from "../controller/register_controller";
import {transporter} from "../config/email";
import {ActivationController} from "../controller/activation_controller";

const publicRoute = Router();

publicRoute.get("/", (req:Request, res:Response) => {
  res.send("halo");
});
publicRoute.get("/users", UserController.users);
publicRoute.post("/login",LoginController.login);
publicRoute.post("/register",RegisterController.register);
publicRoute.get("/activation",ActivationController.activate);



export default publicRoute;
