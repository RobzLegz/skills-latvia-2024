import { playlistCtrl } from "@/controllers/playlistCtrl";
import { NextApiRequest, NextApiResponse } from "next";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method) {
    case "PUT":
      playlistCtrl.edit(req, res);
    case "DELETE":
      playlistCtrl.edit(req, res);
  }
}
