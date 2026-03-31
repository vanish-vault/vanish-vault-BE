import { AppDataSource } from "../config/data-source";
import { User } from "../entities/User";
import { Account } from "../entities/Account";
import { hash } from "../libs/password";
import { Plan } from "../entities";
import { getCurrentMonthYear } from "../libs/date";

export const findUserByEmail = async (email: string) => {
  const repo = AppDataSource.getRepository(User);
  return repo.findOneBy({ email });
};

export const findUserByUsername = async (username: string) => {
  const repo = AppDataSource.getRepository(User);
  return repo.findOneBy({ username });
};

export const createUserWithLocalAccount = async (payload: {
  username: string;
  email: string;
  password: string;
  plan: Plan;
}) => {
  const { username, email, password, plan } = payload;
  const queryRunner = AppDataSource.createQueryRunner();

  await queryRunner.connect();
  await queryRunner.startTransaction();

  try {
    const user = queryRunner.manager.create(User, {
      username,
      email,
      emailVerified: false,
      plan,
    });

    await queryRunner.manager.save(user);

    const hashedPassword = await hash(password);
    const account = queryRunner.manager.create(Account, {
      accountId: `${user.id}-local`,
      providerId: "local",
      userId: user.id,
      user,
      password: hashedPassword,
    });

    await queryRunner.manager.save(account);

    await queryRunner.commitTransaction();
    return { user, account };
  } catch (err) {
    await queryRunner.rollbackTransaction();
    throw err;
  } finally {
    await queryRunner.release();
  }
};

export const findLocalAccountByUserId = async (userId: string) => {
  const repo = AppDataSource.getRepository(Account);
  return repo.findOne({
    where: { userId, providerId: "local" },
    relations: ["user"],
  });
};

export const findLocalAccountByUsernameOrEmail = async (identifier: string) => {
  const userRepo = AppDataSource.getRepository(User);
  const accountRepo = AppDataSource.getRepository(Account);

  const user = await userRepo.findOne({
    where: [
      { username: identifier.toLowerCase() },
      { email: identifier.toLowerCase() },
    ],
  });
  if (!user) return null;

  return accountRepo.findOne({
    where: { userId: user.id, providerId: "local" },
    relations: ["user"],
  });
};

export const findOrCreateUserWithGoogle = async (payload: {
  googleId: string;
  username: string;
  email: string;
  name: string;
  picture?: string;
}) => {
  const { googleId, username, email, name, picture } = payload;
  const userRepo = AppDataSource.getRepository(User);
  const accountRepo = AppDataSource.getRepository(Account);
  const queryRunner = AppDataSource.createQueryRunner();

  await queryRunner.connect();
  await queryRunner.startTransaction();

  try {
    // Check if Google account already exists
    let account = await queryRunner.manager.findOne(Account, {
      where: { accountId: googleId, providerId: "google" },
      relations: ["user"],
    });

    if (account) {
      await queryRunner.commitTransaction();
      return { user: account.user, account, isNew: false };
    }

    // Check if user exists by email or username (to prevent duplicates)
    let user = await queryRunner.manager.findOne(User, {
      where: [{ email }, { username: username }],
    });

    if (!user) {
      // Create new user
      user = queryRunner.manager.create(User, {
        name,
        username,
        email,
        image: picture,
        emailVerified: true,
      });
      await queryRunner.manager.save(user);
    }

    // Create Google account linked to user
    account = queryRunner.manager.create(Account, {
      accountId: googleId,
      providerId: "google",
      userId: user.id,
      user,
      accessToken: "",
    });
    await queryRunner.manager.save(account);

    await queryRunner.commitTransaction();
    return { user, account, isNew: true };
  } catch (err) {
    await queryRunner.rollbackTransaction();
    throw err;
  } finally {
    await queryRunner.release();
  }
};

export const findUserById = async (id: string) => {
  const repo = AppDataSource.getRepository(User);
  return repo.findOne({
    where: { id },
    relations: ["plan"],
  });
};

export const updateUserById = async (id: string, data: Partial<User>) => {
  const repo = AppDataSource.getRepository(User);
  return repo.update(id, data);
};

export const updateUserPlanByEmail = async (
  email: string,
  razorpayCustomerId: string,
  plan: Plan,
) => {
  const repo = AppDataSource.getRepository(User);
  return repo.update({ email }, { razorpayCustomerId, plan });
};

export const updateUserPlanByCustomerId = async (
  razorpayCustomerId: string,
  plan: Plan,
) => {
  const repo = AppDataSource.getRepository(User);
  return repo.update({ razorpayCustomerId }, { plan });
};

/**
 * Atomically increments the user's monthly file upload counter.
 * If the stored month differs from the current month the counter is reset to 1.
 * Returns the new counter value.
 */
export const incrementMonthlyFileUploads = async (
  userId: string,
): Promise<number> => {
  const repo = AppDataSource.getRepository(User);
  const currentMonthYear = getCurrentMonthYear();

  // Fetch current state
  const user = await repo.findOne({ where: { id: userId }, select: ["id", "monthlyFileUploads", "fileUploadMonthYear"] });
  if (!user) throw new Error("User not found");

  const isNewMonth = user.fileUploadMonthYear !== currentMonthYear;
  const newCount = isNewMonth ? 1 : (user.monthlyFileUploads ?? 0) + 1;

  await repo.update(userId, {
    monthlyFileUploads: newCount,
    fileUploadMonthYear: currentMonthYear,
  });

  return newCount;
};
