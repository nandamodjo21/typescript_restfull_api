import { Router,Request,Response } from "express";
import { UserController } from "../controller/user_controller";
import {LoginController} from "../controller/login_controller";
import {RegisterService} from "../service/register_service";
import {RegisterController} from "../controller/register_controller";

const publicRoute = Router();

publicRoute.get("/", (req:Request, res:Response) => {
  res.send("halo");
});
publicRoute.get("/users", UserController.users);
publicRoute.post("/login",LoginController.login);
publicRoute.post("/register",RegisterController.register);



export default publicRoute;
