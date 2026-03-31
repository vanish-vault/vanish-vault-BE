import { Router } from "express";
import {
  createSubscription,
  transactionWebhook,
} from "../controllers/payment.controller";
import { createPaymentValidation } from "../validations/payment.validation";
import { authMiddleware } from "../middleware/auth.middleware";

const router = Router();

router.post(
  "/create-subscription",
  authMiddleware,
  createPaymentValidation,
  createSubscription,
);

router.post("/transaction-webhook", transactionWebhook);

export default router;
