import jwt from "jsonwebtoken";

export const generateRefreshToken = (payload: any) =>
  jwt.sign(payload, String(process.env.REFRESH_TOKEN_SECRET));
