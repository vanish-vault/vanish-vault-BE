import * as planRepository from "../repositories/plan.repository";
import * as userRepository from "../repositories/user.repository";
import * as secretRepository from "../repositories/secret.repository";
import { getCurrentMonthYear } from "../libs/date";

export const getPlans = async () => {
  const plans = await planRepository.getPlans();

  const response = {};
  return plans;
};

export const getUserPlan = async (userId: string) => {
  try {
    const user = await userRepository.findUserById(userId);
    if (!user) {
      throw new Error("User not found");
    }

    const usage = await secretRepository.countSecretsByUserId(userId);

    // Monthly file upload stats (reset if new month)
    const currentMonthYear = getCurrentMonthYear();
    const isNewMonth = user.fileUploadMonthYear !== currentMonthYear;
    const monthlyFileUploads = isNewMonth ? 0 : (user.monthlyFileUploads ?? 0);

    return {
      plan: user.plan,
      usage,
      total: user.plan.maxSecrets,
      monthlyFileUploads,
      maxFiles: user.plan.maxFiles,
    };
  } catch (error) {
    throw error;
  }
};


