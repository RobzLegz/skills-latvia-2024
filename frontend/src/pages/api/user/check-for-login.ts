import { userCtrl } from "@/controllers/userCtrl";
import { NextApiRequest, NextApiResponse } from "next";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method) {
    case "GET":
      userCtrl.checkForLogin(req, res);
  }
}
