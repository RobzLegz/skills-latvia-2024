import { NextApiRequest, NextApiResponse } from "next";
import jwt from "jsonwebtoken";
import { prisma } from "@/lib/prisma";

export const auth = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const { refresh_token } = req.cookies;
    if (!refresh_token) {
      res.status(400).json({ err: "Unauthorized" });
      return null;
    }

    const valid = jwt.verify(
      refresh_token,
      String(process.env.REFRESH_TOKEN_SECRET)
    );

    if (!valid) {
      res.status(400).json({ err: "Unauthorized" });
      return null;
    }

    const u = await prisma.user.findFirst({ where: { id: Number(valid) } });
    if (!u) {
      res.status(400).json({ err: "Unauthorized" });
      return null;
    }

    return u;
  } catch (err: any) {
    console.log(err);
  }
};
