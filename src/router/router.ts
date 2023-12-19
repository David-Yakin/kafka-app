import express, { Request, Response } from "express";
const router = express.Router();
import usersRoutes from "../users/routes/usersRoutes";

router.use("/users", usersRoutes);
router.use(express.static("../../public"));
router.use("*", (req: Request, res: Response) =>
  res.status(404).send("Page not found!")
);

export default router;
