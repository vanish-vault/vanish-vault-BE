import { AppDataSource } from "../config/data-source";
import { Plan } from "../entities";

export const planRepository = AppDataSource.getRepository(Plan);

export const getPlans = async () => {
  return await planRepository.find({
    order: {
      price: "ASC",
    },
  });
};

export const getPlanByRazorPayId = async (razorpayPlanId: string) => {
  return await planRepository.findOne({
    where: {
      razorpayPlanId,
    },
  });
};

export const getFreePlan = async () => {
  return await planRepository.findOne({
    where: {
      price: 0,
    },
  });
};

export const getPlanById = async (id: string) => {
  return await planRepository.findOne({
    where: {
      id,
    },
  });
};
