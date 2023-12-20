import express, { Request, Response } from "express";
const router = express.Router();

router.use(express.static("../../public"));
router.use("*", (req: Request, res: Response) =>
  res.status(404).send("Page not found!")
);

export default router;
