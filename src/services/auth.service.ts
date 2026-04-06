import { randomBytes } from "crypto";
import {
  findUserByEmail,
  findUserByUsername,
  createUserWithLocalAccount,
  findLocalAccountByUsernameOrEmail,
  findOrCreateUserWithGoogle,
} from "../repositories/user.repository";
import { compare } from "../libs/password";
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} from "../utils/jwt";
import { RegisterDTO } from "../validations/auth.validation";
import * as planRepository from "../repositories/plan.repository";
import { HttpError } from "../libs/errors";

export const register = async (payload: RegisterDTO) => {
  const { username, email, password } = payload;

  const existingEmail = await findUserByEmail(email.toLowerCase());
  if (existingEmail) throw new HttpError("Email already in use", 409);

  const existingUsername = await findUserByUsername(username.toLowerCase());
  if (existingUsername) throw new HttpError("Username already in use", 409);

  const freePlan = await planRepository.getFreePlan();
  if (!freePlan) throw new HttpError("Free plan not found", 404);

  const { user } = await createUserWithLocalAccount({
    username: username.toLowerCase(),
    email: email.toLowerCase(),
    password,
    plan: freePlan,
  });

  const accessToken = generateAccessToken(user.id);
  const refreshToken = generateRefreshToken(user.id);

  return {
    user: { id: user.id, username: user.username, email: user.email },
    accessToken,
    refreshToken,
  };
};

export const login = async (identifier: string, password: string) => {
  const account = await findLocalAccountByUsernameOrEmail(identifier);
  if (!account) throw new HttpError("Invalid credentials", 401);

  const ok = await compare(password, account.password || "");
  if (!ok) throw new HttpError("Invalid credentials", 401);

  const accessToken = generateAccessToken(account.user.id);
  const refreshToken = generateRefreshToken(account.user.id);

  return {
    user: {
      id: account.user.id,
      username: account.user.username,
      email: account.user.email,
    },
    accessToken,
    refreshToken,
  };
};

export const refresh = async (refreshToken: string) => {
  try {
    const decoded: any = verifyRefreshToken(refreshToken);
    const userId = decoded.id;

    const newAccessToken = generateAccessToken(userId);
    const newRefreshToken = generateRefreshToken(userId);

    return {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    };
  } catch (err: any) {
    throw new Error(err.message);
  }
};

export const loginWithGoogle = async (idToken: string) => {
  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const { OAuth2Client } = require("google-auth-library");
    const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

    const ticket = await client.verifyIdToken({
      idToken,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    if (!payload) throw new HttpError("Invalid Google token", 401);

    const { sub: googleId, email, name, picture } = payload;

    const { user } = await findOrCreateUserWithGoogle({
      googleId,
      username: generateUsernameFromEmail(email),
      email: email.toLowerCase(),
      name,
      picture,
    });

    const accessToken = generateAccessToken(user.id);
    const refreshToken = generateRefreshToken(user.id);

    return {
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        name: user.name,
      },
      accessToken,
      refreshToken,
    };
  } catch (err: any) {
    throw new Error(err?.message || "Google authentication failed");
  }
};

const generateUsernameFromEmail = (email: string): string => {
  const localPart = email.split("@")[0] || "user";
  // Sanitize: only keep alphanumeric characters and underscores
  const sanitized = localPart.replace(/[^a-zA-Z0-9_]/g, "_").toLowerCase();
  // Add random suffix to ensure uniqueness (cryptographically secure)
  const randomSuffix = randomBytes(4).toString("hex").substring(0, 6);
  return `${sanitized}_${randomSuffix}`;
};
