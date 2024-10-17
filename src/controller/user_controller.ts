
import { UserService } from "../service/user_service";
import {NextFunction,Request,Response} from "express";

export class UserController {
  static async users(req: Request, res: Response, next: NextFunction) {
    try {
      const response = await UserService.users();
      res.status(200).json({
        status:true,
        message:"data found",
        data: response,
      });
    } catch (error) {
      next(error);
    }
  }
}
