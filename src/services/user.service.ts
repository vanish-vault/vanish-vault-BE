import { compare } from "../libs/password";
import {
  ChangeNameDTO,
  ChangePasswordDTO,
} from "../validations/user.validation";
import {
  upsertLocalAccountPassword,
  findAccountByUserId,
} from "../repositories/account.repository";
import { findUserById, updateUserById } from "../repositories/user.repository";

export const changePassword = async (
  data: ChangePasswordDTO,
  userId: string,
) => {
  try {
    const account = await findAccountByUserId(userId);

    if (account) {
      // User has an existing local account — validate old password if one is set
      if (account.password && !data.oldPassword) {
        throw new Error("Old password is required");
      }
      if (data.oldPassword && account.password) {
        const isPasswordValid = await compare(data.oldPassword, account.password);
        if (!isPasswordValid) {
          throw new Error("Invalid password");
        }
      }
    }
    // Upsert: creates a local account if user only had Google, otherwise updates
    await upsertLocalAccountPassword(userId, data.newPassword);
  } catch (err: any) {
    throw new Error(err.message);
  }
};

export const changeName = async (data: ChangeNameDTO, userId: string) => {
  try {
    const account = await findUserById(userId);
    if (!account) {
      throw new Error("User not found");
    }
    await updateUserById(userId, { name: data.name });
  } catch (err: any) {
    throw new Error(err.message);
  }
};
