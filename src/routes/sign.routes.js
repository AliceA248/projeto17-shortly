import { Router } from "express";
import { createUser } from "../controllers/users.controller.js";
import { signIn } from "../controllers/auth.controller.js";
import { validateSchema } from "../middlewares/validateSchema.js";
import loginSchema from "../schemas/login.schema.js";
import userSchema from "../schemas/user.schema.js";

const router = Router();

router.post("/signin", validateSchema(loginSchema), signIn);
router.post("/signup", validateSchema(userSchema), createUser);

export default router;
