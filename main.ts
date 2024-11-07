import express, {Request, Response} from "express";

import { errorMiddleware } from "./src/middleware/error_middleware";
const app = express();
import init from "./src/config/init";
import { ResponseError } from "./src/error/response_error";
import {UserController} from "./src/controller/user_controller";
import {LoginController} from "./src/controller/login_controller";
import {RegisterController} from "./src/controller/register_controller";
import {ActivationController} from "./src/controller/activation_controller";
import {OtpController} from "./src/controller/otp_controller";
import publicRoute from "./src/routes/public_route";
app.use(express.json());
app.use(errorMiddleware);
app.get("/", (req: Request, res: Response) => {
  res.send("halo");
});
app.get("/users", UserController.users);
app.post("/login", LoginController.login);
app.post("/register", RegisterController.register);
app.get("/activation", ActivationController.activate);
app.get("/otp",OtpController.activated);
async function runInit() {
  try {
    await init();
  } catch (e) {
    throw new ResponseError(404, `${e}`);
  }
}
runInit().then(r =>{
  console.log("run init");
} ).catch(reason => {
  throw new ResponseError(500,`${reason}`);
});

app.listen(process.env.APP_PORT, function () {
  console.log(
    `${process.env.APP_NAME} is running on ${process.env.BASE_URL}:${process.env.APP_PORT} `
  );
});
