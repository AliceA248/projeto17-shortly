import {Router} from "express";
import urlsRouter from "./urls.routes.js";
import usersRouter from "./users.routes.js";
import authRouter from "./sign.routes.js";

const router = Router();

router.use(authRouter);
router.use(usersRouter);
router.use(urlsRouter);

export default router;