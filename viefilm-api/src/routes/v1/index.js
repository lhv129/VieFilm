import express from "express";
import { userRoute } from "@/routes/v1/userRouter";
import { roleRouter } from "@/routes/v1/roleRouter";

const Router = express.Router();

// User APIs
Router.use('/users',userRoute);

// Role APIs
Router.use('/roles',roleRouter);

export const APIs_v1 = Router;