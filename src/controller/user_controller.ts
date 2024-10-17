import { Request, Response, NextFunction } from "express";
import { UserService } from "../service/user_service";

export class UserController {
  static async users(req: Request, res: Response, next: NextFunction) {
    try {
      const response = await UserService.users();
      res.status(200).json({
        data: response,
      });
    } catch (error) {
      next(error);
    }
  }
}
