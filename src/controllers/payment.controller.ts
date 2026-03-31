import { successResponse } from "../handlers/response.handler";
import * as paymentService from "../services/payment.service";

export const createSubscription = async (req: any, res: any, next: any) => {
  try {
    const { planId } = req.body;
    const result = await paymentService.createSubscription(planId);
    return successResponse(res, result);
  } catch (error) {
    next(error);
  }
};

export const transactionWebhook = async (req: any, res: any, next: any) => {
  try {
    const result = await paymentService.transactionWebhook(
      req.headers["x-razorpay-signature"],
      req.body,
    );
    return successResponse(res, result);
  } catch (error) {
    next(error);
  }
};
