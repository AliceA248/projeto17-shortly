import { Router } from "express";
import { validateSchema } from "../middlewares/validateSchema.js";
import loginSchema from "../schemas/loginSchema.js";
import userSchema from "../schemas/userSchema.js";
import { createUser } from "../controllers/users.controller.js";
import { signIn } from "../controllers/auth.controller.js";

const router = Router();

router.post("/signin", validateSchema(loginSchema), signIn);
router.post("/signup", validateSchema(userSchema), createUser);

export default router;
