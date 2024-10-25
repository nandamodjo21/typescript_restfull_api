import express from "express";
import publicRoute from "./src/routes/public_route";
import { errorMiddleware } from "./src/middleware/error_middleware";
import { startBot } from "./src/utils/star_sock";
const app = express();
import init from "./src/config/init";
import { ResponseError } from "./src/error/response_error";
app.use(express.json());
app.use(publicRoute);
app.use(errorMiddleware);

async function runInit() {
  try {
    await init();
  } catch (e) {
    throw new ResponseError(404, `${e}`);
  }
}
runInit();

app.listen(process.env.APP_PORT, function () {
  console.log(
    `${process.env.APP_NAME} is running on ${process.env.BASE_URL}:${process.env.APP_PORT} `
  );
});
