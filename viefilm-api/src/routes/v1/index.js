import express from "express";
import { userRouter } from "@/routes/v1/userRouter";
import { roleRouter } from "@/routes/v1/roleRouter";
import { authRouter } from "@/routes/v1/authRouter";

const Router = express.Router();

// Auth APIs
Router.use('/auth',authRouter);

// User APIs
Router.use('/users',userRouter);

// Role APIs
Router.use('/roles',roleRouter);

export const APIs_v1 = Router;