import razorpayUtils from "../utils/razorpay";
import * as webhookRepository from "../repositories/webhook.repository";
import * as userRepository from "../repositories/user.repository";
import { SUBSCRIPTION_EVENT } from "../libs/constants";
import * as planRepository from "../repositories/plan.repository";

export const createSubscription = async (planId: string) => {
  try {
    const result = await razorpayUtils.createSubscription(planId);
    return result;
  } catch (error) {
    throw error;
  }
};

export const transactionWebhook = async (signature: string, body: any) => {
  try {
    const result = await razorpayUtils.verifyWebhookSignature(signature, body);
    if (result) {
      await webhookRepository.storeWebhook(body);

      if (body.event === SUBSCRIPTION_EVENT.ACTIVATED) {
        const plan = await planRepository.getPlanByRazorPayId(
          body.payload.subscription.entity.plan_id,
        );
        if (plan) {
          await userRepository.updateUserPlanByEmail(
            body.payload.subscription.entity.customer_email,
            body.payload.subscription.entity.customer_id,
            plan,
          );
        }
      }

      if (body.event === SUBSCRIPTION_EVENT.CANCELLED) {
        const plan = await planRepository.getFreePlan();

        if (plan) {
          await userRepository.updateUserPlanByCustomerId(
            body.payload.subscription.entity.customer_id,
            plan,
          );
        }
      }

      if (body.event === SUBSCRIPTION_EVENT.HALTED) {
        const plan = await planRepository.getFreePlan();

        if (plan) {
          await userRepository.updateUserPlanByCustomerId(
            body.payload.subscription.entity.customer_id,
            plan,
          );
        }
      }
    }
  } catch (error) {
    throw error;
  }
};
