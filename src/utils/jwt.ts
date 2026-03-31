import jwt, { SignOptions } from "jsonwebtoken";

export const generateAccessToken = (userId: string) => {
  try {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      throw new Error("JWT_SECRET is not defined");
    }
    const options: SignOptions = {
      expiresIn: (process.env.JWT_SECRET_EXPIRES_IN as any) || "1h",
    };
    return jwt.sign({ id: userId }, secret, options);
  } catch (err) {
    throw new Error("Error generating token");
  }
};

export const generateRefreshToken = (userId: string) => {
  try {
    const secret = process.env.JWT_REFRESH_SECRET;
    if (!secret) {
      throw new Error("JWT_REFRESH_SECRET is not defined");
    }
    const options: SignOptions = {
      expiresIn: (process.env.JWT_REFRESH_EXPIRES_IN as any) || "7d",
    };
    return jwt.sign({ id: userId }, secret, options);
  } catch (err) {
    throw new Error("Error generating token");
  }
};

export const verifyAccessToken = (token: string) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET!);
  } catch (err) {
    throw new Error("Invalid token");
  }
};

export const verifyRefreshToken = (token: string) => {
  try {
    return jwt.verify(token, process.env.JWT_REFRESH_SECRET!);
  } catch (err: any) {
    throw new Error(err.message);
  }
};
