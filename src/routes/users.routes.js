import { Router } from "express";
import { getUser, getRanking } from "../controllers/users.controller.js";
import { authValidation } from "../middlewares/authorization.middleware.js";

const router = Router();

router.get("/users/me", authValidation, getUser);
router.get("/ranking", getRanking);

export default router;
