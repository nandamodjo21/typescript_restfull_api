import { Router } from "express";

const publicRoute = Router();

publicRoute.get("/", (req, res) => {
  res.send("halo");
});
publicRoute.get("/users");
export default publicRoute;
