import { Router,Request,Response } from "express";
import { UserController } from "../controller/user_controller";

const publicRoute = Router();

publicRoute.get("/", (req:Request, res:Response) => {
  res.send("halo");
});
publicRoute.get("/users", UserController.users);
export default publicRoute;
