import { prisma } from "@/lib/prisma";
import { NextApiRequest, NextApiResponse } from "next";
import bcrypt from "bcrypt";
import { serialize } from "cookie";
import { generateRefreshToken } from "@/utils/createRefreshToken";
import { auth } from "@/middleware/auth";

export const userCtrl = {
  register: async (req: NextApiRequest, res: NextApiResponse) => {
    try {
      const { username, password } = req.body;

      if (!username || !password) {
        return res.status(400).json({ err: "Aizpildiet visus datus" });
      }

      if (username.lengh < 3) {
        return res
          .status(400)
          .json({ err: "Lietotājvārdam jabut vismas 3 rakstzīmes garam" });
      }

      if (password.lengh < 3) {
        return res
          .status(400)
          .json({ err: "Parolei jabut vismas 3 rakstzīmes garam" });
      }

      const u = await prisma.user.findFirst({ where: { username } });
      if (u) {
        return res.status(400).json({ err: "Lietotājvārds jau aizņemts" });
      }

      const saltRounds = 10;

      const p = await bcrypt.hash(password, saltRounds);

      const user = await prisma.user.create({
        data: { username, password: p },
      });

      const token = generateRefreshToken(user.id);

      const cookie = serialize("refresh_token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 60 * 60 * 24 * 7,
        path: "/",
      });

      res.setHeader("Set-Cookie", cookie);

      return res.json(user);
    } catch (err: any) {
      console.log(err.message);
      return res.status(500).json({ err: "Radās kļūme" });
    }
  },
  login: async (req: NextApiRequest, res: NextApiResponse) => {
    try {
      const { username, password } = req.body;

      if (!username || !password) {
        return res.status(400).json({ err: "Aizpildiet visus datus" });
      }

      if (username.lengh < 3) {
        return res
          .status(400)
          .json({ err: "Lietotājvārdam jabut vismas 3 rakstzīmes garam" });
      }

      if (password.lengh < 3) {
        return res
          .status(400)
          .json({ err: "Parolei jabut vismas 3 rakstzīmes garam" });
      }

      const user = await prisma.user.findFirst({ where: { username } });

      if (!user) {
        return res
          .status(404)
          .json({ err: "Lietotājs ar šādu lietotājvārdu netika atrasts" });
      }

      bcrypt.compare(password, user.password, function (err, result) {
        if (result) {
          const token = generateRefreshToken(user.id);

          const cookie = serialize("refresh_token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            maxAge: 60 * 60 * 24 * 7,
            path: "/",
          });

          res.setHeader("Set-Cookie", cookie);

          return res.json(user);
        } else {
          return res.status(400).json({ err: "Nepareiza parole" });
        }
      });
    } catch (err: any) {
      console.log(err.message);
      return res.status(500).json({ err: "Radās kļūme" });
    }
  },
  logout: async (req: NextApiRequest, res: NextApiResponse) => {
    try {
      const cookie = serialize("refresh_token", "", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 60 * 60 * 24 * 7,
        path: "/",
      });

      res.setHeader("Set-Cookie", cookie);
      res.json("Ok");
    } catch (err: any) {
      console.log(err.message);
      return res.status(500).json({ err: "Radās kļūme" });
    }
  },
  checkForLogin: async (req: NextApiRequest, res: NextApiResponse) => {
    try {
      const a = await auth(req, res);
      if (!a) {
        return;
      }

      const playlists = await prisma.playlist.findMany({
        where: { userId: a.id },
        include: {
          songs: {
            select: { songId: true },
          },
        },
      });

      res.json({ ...a, playlists });
    } catch (err: any) {
      console.log(err.message);
      return res.status(500).json({ err: "Radās kļūme" });
    }
  },
};
