import express from "express";
import {
  handleGetUser,
  handleGetUsers,
  handleUserRegistration,
} from "../controllers/usersControllers";
const router = express.Router();

router.get("/", handleGetUsers);
// router.get("/", auth, getCachedUsers, handleGetUsers);
router.get("/:id", handleGetUser);
router.post("/", handleUserRegistration);
// router.put("/:id", auth, handleEditUser);
// router.delete("/:id", auth, handleDeleteUser);
// router.post("/login", handleLogin);

export default router;
