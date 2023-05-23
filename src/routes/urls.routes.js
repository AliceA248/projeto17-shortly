import { Router } from "express";
import { deleteUrl, getUrlId, openShortUrl, shortUrl, getUserData } from "../controllers/url.controller.js";
import { authValidation } from "../middlewares/authorization.middleware.js";
import { validateSchema } from "../middlewares/validateSchema.js";
import urlSchema from "../schemas/url.schema.js";

const router = Router();

router.post("/urls/shorten",validateSchema(urlSchema),authValidation,shortUrl);
router.get("/urls/:id", getUrlId);
router.get("/urls/open/:shortUrl", openShortUrl);
router.get("/users/me", authValidation, getUserData);
router.delete("/urls/:id", authValidation, deleteUrl);



export default router;
