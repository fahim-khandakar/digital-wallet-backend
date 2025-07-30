import { Router } from "express";
import { validateRequest } from "../../middlewares/validateRequest";
import { AuthControllers } from "./auth.controller";
import { loginZodSchema } from "./auth.validation";

const router = Router();

router.post(
  "/login",
  validateRequest(loginZodSchema),
  AuthControllers.credentialsLogin
);

export const LoginRoutes = router;
