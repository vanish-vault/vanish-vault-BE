import { AppDataSource } from "../config/data-source";
import { User } from "../entities/User";
import { Account } from "../entities/Account";
import { hash } from "../libs/password";

export const findAccountByUserId = async (userId: string) => {
  const repo = AppDataSource.getRepository(Account);
  // Explicitly filter to local provider so Google account rows are never returned
  return repo.findOne({ where: { user: { id: userId }, providerId: "local" } });
};

export const updateAccountPassword = async (
  userId: string,
  password: string,
) => {
  const repo = AppDataSource.getRepository(Account);
  const hashedPassword = await hash(password);
  return repo.update(
    { user: { id: userId }, providerId: "local" },
    { password: hashedPassword },
  );
};

/**
 * Creates a local account for the user if they don't already have one
 * (e.g. they signed up via Google and are now setting a password),
 * or updates the existing local account's password.
 */
export const upsertLocalAccountPassword = async (
  userId: string,
  password: string,
) => {
  const repo = AppDataSource.getRepository(Account);
  const hashedPassword = await hash(password);

  const existing = await repo.findOne({
    where: { userId, providerId: "local" },
  });

  if (existing) {
    await repo.update(existing.id, { password: hashedPassword });
  } else {
    const account = repo.create({
      accountId: `${userId}-local`,
      providerId: "local",
      userId,
      password: hashedPassword,
    });
    await repo.save(account);
  }
};
