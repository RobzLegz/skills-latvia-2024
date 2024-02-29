import { prisma } from "@/lib/prisma";
import { NextApiRequest, NextApiResponse } from "next";
import { auth } from "@/middleware/auth";
import { songs } from "@/data/songs";

export const songCtrl = {
  addToPlaylist: async (req: NextApiRequest, res: NextApiResponse) => {
    try {
      const a = await auth(req, res);
      if (!a) {
        return;
      }

      const { songId, playlistIds } = req.body;

      if (!songId) {
        return res.status(400).json({ err: "No song selected" });
      }

      for (const p of playlistIds) {
        await prisma.songInPlaylist.create({
          data: {
            songId,
            playlistId: p,
          },
        });
      }

      const playlists = await prisma.playlist.findMany({
        where: { userId: a.id },
        include: {
          songs: {
            select: { songId: true },
          },
        },
      });

      res.json({ msg: "Added to these playlists", playlists });
    } catch (err: any) {
      console.log(err.message);
      return res.status(500).json({ err: "Radās kļūme" });
    }
  },
  create: async (req: NextApiRequest, res: NextApiResponse) => {
    try {
      const a = await auth(req, res);
      if (!a) {
        return;
      }

      const { title, description, length, file_id } = req.body;
      if (!title) {
        return res.status(400).json({ err: "No title provided" });
      }

      const song = await prisma.song.create({
        data: { title, description, length, file_id },
      });

      res.json(song);
    } catch (err: any) {
      console.log(err.message);
      return res.status(500).json({ err: "Radās kļūme" });
    }
  },
  write: async (req: NextApiRequest, res: NextApiResponse) => {
    try {
      await prisma.songInPlaylist.deleteMany();
      await prisma.song.deleteMany();

      for (const song of songs) {
        const so = await prisma.song.create({ data: { ...song } });
        console.log(so);
      }

      res.json("OK");
    } catch (err: any) {
      console.log(err.message);
      return res.status(500).json({ err: "Radās kļūme" });
    }
  },
  getAll: async (req: NextApiRequest, res: NextApiResponse) => {
    try {
      const songs = await prisma.song.findMany();

      res.json(songs);
    } catch (err: any) {
      console.log(err.message);
      return res.status(500).json({ err: "Radās kļūme" });
    }
  },
};
