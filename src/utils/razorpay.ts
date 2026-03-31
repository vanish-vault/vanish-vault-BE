import Razorpay from "razorpay";
import { validateWebhookSignature } from "razorpay/dist/utils/razorpay-utils";

class RazorpayUtils {
  private razorpay: Razorpay;

  constructor() {
    this.razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID!,
      key_secret: process.env.RAZORPAY_KEY_SECRET!,
    });
  }

  async createSubscription(planId: string) {
    try {
      const order = await this.razorpay.subscriptions.create({
        plan_id: planId,
        quantity: 1,
        total_count: 1,
        expire_by: Math.floor(Date.now() / 1000) + 365 * 24 * 60 * 60, // 1 year
        addons: [
          {
            item: {
              name: "VanishVault Pro",
              amount: 499,
              currency: "INR",
            },
          },
        ],
      });
      return order;
    } catch (error) {
      console.error("Razorpay Error:", error);
      throw error;
    }
  }

  async verifyWebhookSignature(signature: string, body: any) {
    try {
      const result = validateWebhookSignature(
        JSON.stringify(body),
        signature,
        process.env.RAZORPAY_WEBHOOK_SECRET!,
      );
      return result;
    } catch (error) {
      console.error("Razorpay Error:", error);
      throw error;
    }
  }
}

export default new RazorpayUtils();
