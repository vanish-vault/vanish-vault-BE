require("dotenv").config();

import "reflect-metadata";
import { AppDataSource } from "../data-source";
import { Plan } from "../../entities/Plan";

const plans = [
  {
    name: "Free",
    description: "Perfect for personal use and trying out VanishVault",
    razorpayPlanId: "",
    price: 0,
    interval: "forever",
    isMostPopular: false,
    maxSecrets: 5,
    maxFiles: 3,
    maxViews: 100,
    maxFileSize: 10485760, // 10MB
    maxFileCount: 3,
    maxExpiry: 86400, // 24 hours
    encryptionType: "Basic AES-256 encryption",
    hasPasswordProtection: true,
    supportType: "Email support",
    hasQrCode: true,
    features: [
      "Unlimited secure links per month",
      "Up to 1MB file size",
      "Up to 3 file uploads per month",
      "24 hour maximum expiry",
      "Basic AES-256 encryption",
      "Password protection",
      "Email support",
      "View limits",
      "QR code generation",
    ],
  },
  {
    name: "Pro",
    description: "For professionals and teams who need advanced security",
    razorpayPlanId: "plan_SRyxRYAMp2Eckp",
    price: 499,
    interval: "year",
    isMostPopular: true,
    maxSecrets: -1,
    maxFiles: -1,
    maxViews: -1,
    maxFileSize: 104857600, // 100MB
    maxFileCount: -1,
    maxExpiry: 2592000, // 30 days
    encryptionType: "Advanced AES-256 encryption",
    hasPasswordProtection: true,
    supportType: "Priority support (24/7)",
    hasQrCode: true,
    features: [
      "Unlimited secure links",
      "Up to 100MB file size",
      "Unlimited file uploads per month",
      "30 day maximum expiry",
      "Advanced AES-256 encryption",
      "Password protection",
      "Priority support (24/7)",
      "Unlimited view limits",
      "QR code generation",
    ],
  },
];

async function seedPlans() {
  try {
    await AppDataSource.initialize();
    console.log("Database connection initialized.");

    const planRepo = AppDataSource.getRepository(Plan);

    // clear existing if any or just update/insert? Better to Upsert by name
    for (const planData of plans) {
      let plan = await planRepo.findOneBy({ name: planData.name });
      if (plan) {
        Object.assign(plan, planData);
        await planRepo.save(plan);
        console.log(`Updated plan: ${plan.name}`);
      } else {
        plan = planRepo.create(planData);
        await planRepo.save(plan);
        console.log(`Created plan: ${plan.name}`);
      }
    }

    console.log("Seeding complete!");
    process.exit(0);
  } catch (error) {
    console.error("Error seeding details:", error);
    process.exit(1);
  }
}

seedPlans();
