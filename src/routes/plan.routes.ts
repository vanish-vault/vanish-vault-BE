import { Router } from "express";
import { getPlans, getUserPlan } from "../controllers/plan.controller";
import { authMiddleware } from "../middleware/auth.middleware";

const router = Router();

router.get("/", getPlans);

router.get("/user-plan", authMiddleware, getUserPlan);

export default router;
