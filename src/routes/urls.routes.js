import { Router } from "express";
import { authValidation } from "../middlewares/authorization.middleware.js";
import { validateSchema } from "../middlewares/validateSchema.js";
import urlSchema from "../schemas/urlSchema.js";
import { deleteUrl, getUrlId, openShortUrl, shortUrl } from "../controllers/url.controller.js";

const router = Router();

router.post(
  "/urls/shorten",
  validateSchema(urlSchema),
  authValidation,
  shortUrl
);
router.get("/urls/:id", getUrlId);
router.get("/urls/open/:shortUrl", openShortUrl);
router.delete("/urls/:id", authValidation, deleteUrl);

export default router;
