
import { Router } from "express";
import species from "./species.js";
import predict from "./predict.js";
import recommend from "./recommend.js";

const r = Router();
r.use("/species", species);
r.use("/predict", predict);
r.use("/recommend", recommend);

export default r;
