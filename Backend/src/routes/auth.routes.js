import { Router } from "express";
import passport from "passport";
import { googleCallback } from "../controllers/googleAuthController.js";

const router = Router();

// iniciar auth google
router.get("/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

// callback google
router.get("/google/callback",
  passport.authenticate("google", { session: false }),
  googleCallback
);

export default router;
