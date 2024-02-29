import { songCtrl } from "@/controllers/songCtrl";
import { NextApiRequest, NextApiResponse } from "next";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method) {
    case "POST":
      songCtrl.create(req, res);
    case "GET":
      songCtrl.getAll(req, res);
  }
}
