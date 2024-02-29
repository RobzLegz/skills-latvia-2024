import { playlistCtrl } from "@/controllers/playlistCtrl";
import { NextApiRequest, NextApiResponse } from "next";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method) {
    case "POST":
      playlistCtrl.create(req, res);
  }
}
