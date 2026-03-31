import { AppDataSource } from "../config/data-source";
import { Webhook } from "../entities";

export const storeWebhook = async (webhook: any) => {
  try {
    const webhookRepository = AppDataSource.getRepository(Webhook);
    return await webhookRepository.save({
      event: webhook.event,
      payload: JSON.stringify(webhook),
    });
  } catch (error) {
    throw error;
  }
};
