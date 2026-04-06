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
import { HttpError } from "../libs/errors";

export const changePassword = async (
  data: ChangePasswordDTO,
  userId: string,
) => {
  try {
    const account = await findAccountByUserId(userId);

    if (account) {
      // User has an existing local account — validate old password if one is set
      if (account.password && !data.oldPassword) {
        throw new HttpError("Old password is required", 400);
      }
      if (data.oldPassword && account.password) {
        const isPasswordValid = await compare(data.oldPassword, account.password);
        if (!isPasswordValid) {
          throw new HttpError("Invalid password", 401);
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
      throw new HttpError("User not found", 404);
    }
    await updateUserById(userId, { name: data.name });
  } catch (err: any) {
    throw new Error(err.message);
  }
};
