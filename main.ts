import express from "express";
import dotEnv from "dotenv";
import publicRoute from "./src/routes/public_route";
import { errorMiddleware } from "./src/middleware/error_middleware";
const app = express();
dotEnv.config();

app.use(express.json());
app.use(publicRoute);
app.use(errorMiddleware);
app.listen(process.env.APP_PORT, function () {
  console.log(
    `${process.env.APP_NAME} is running on ${process.env.BASE_URL}:${process.env.APP_PORT} `
  );
});
