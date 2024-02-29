import { prisma } from "@/lib/prisma";
import { NextApiRequest, NextApiResponse } from "next";
import { auth } from "@/middleware/auth";

export const playlistCtrl = {
  create: async (req: NextApiRequest, res: NextApiResponse) => {
    try {
      const a = await auth(req, res);
      if (!a) {
        return;
      }

      const { title, description } = req.body;
      if (!title) {
        return res.status(400).json({ err: "No title provided" });
      }

      const playlist = await prisma.playlist.create({
        data: { title, description, userId: a.id },
      });

      res.json(playlist);
    } catch (err: any) {
      console.log(err.message);
      return res.status(500).json({ err: "Radās kļūme" });
    }
  },
  edit: async (req: NextApiRequest, res: NextApiResponse) => {
    try {
      const a = await auth(req, res);
      if (!a) {
        return;
      }

      const { id: playlistId } = req.query;

      const { title, description } = req.body;
      if (!title) {
        return res.status(400).json({ err: "No title provided" });
      }

      const playlist = await prisma.playlist.update({
        where: { id: Number(playlistId) },
        data: { title, description, userId: a.id },
      });

      res.json(playlist);
    } catch (err: any) {
      console.log(err.message);
      return res.status(500).json({ err: "Radās kļūme" });
    }
  },
  deleteOne: async (req: NextApiRequest, res: NextApiResponse) => {
    try {
      const a = await auth(req, res);
      if (!a) {
        return;
      }

      const { id: playlistId } = req.query;

      await prisma.songInPlaylist.deleteMany({
        where: { playlistId: Number(playlistId) },
      });

      await prisma.playlist.delete({
        where: { id: Number(playlistId) },
      });

      res.json({ msg: "Deleted" });
    } catch (err: any) {
      console.log(err.message);
      return res.status(500).json({ err: "Radās kļūme" });
    }
  },
  getOne: async (req: NextApiRequest, res: NextApiResponse) => {
    try {
      const a = await auth(req, res);
      if (!a) {
        return;
      }

      const { id: playlistId } = req.query;

      const p = await prisma.playlist.findFirst({
        where: { id: Number(playlistId) },
        include: {
          songs: {
            select: {
              song: true,
            },
          },
        },
      });

      res.json(p);
    } catch (err: any) {
      console.log(err.message);
      return res.status(500).json({ err: "Radās kļūme" });
    }
  },
};
