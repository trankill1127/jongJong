import express from "express";
import { main, service } from "../controllers/serviceController";

const globalRouter = express.Router();

globalRouter.get("/", main);
globalRouter.get("/service", service);

export default globalRouter;
