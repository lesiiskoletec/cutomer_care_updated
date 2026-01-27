import express from "express";
import {
  createUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUserById,
  approveTeacher,
} from "../application/user.js";

import { authenticate } from "../api/middlewares/authentication.js";
import { authorize } from "../api/middlewares/authrization.js";

const router = express.Router();

router.post("/create", authenticate, authorize(["admin"]), createUser);
router.put("/:id", authenticate, authorize(["admin"]), updateUser);
router.delete("/:id", authenticate, authorize(["admin"]), deleteUserById);

router.patch("/:id/approve-teacher", authenticate, authorize(["admin"]), approveTeacher);

router.get("/", authenticate, authorize(["admin"]), getAllUsers);
router.get("/:id", authenticate, authorize(["admin"]), getUserById);

export default router;
