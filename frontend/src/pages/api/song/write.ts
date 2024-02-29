import { songCtrl } from "@/controllers/songCtrl";
import { NextApiRequest, NextApiResponse } from "next";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method) {
    case "GET":
      songCtrl.write(req, res);
  }
}
