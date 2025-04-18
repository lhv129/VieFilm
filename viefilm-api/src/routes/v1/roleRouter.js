import express from "express";
import { roleValidation } from "@/validations/roleValidation";
import { roleController } from "@/controllers/roleController";

const Router = express.Router();

Router.route("/")
  .get(roleController.getAll)
  .post(roleValidation.createRole, roleController.create);
Router.route("/:slug")
    .get(roleController.getDetails)
    .put(roleValidation.createRole,roleController.updateRole)
    .delete(roleController.getDelete);

export const roleRouter = Router;
