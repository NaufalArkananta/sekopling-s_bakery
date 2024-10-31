import { Router } from "express";
import { authentication, createUser, deleteUser, readUser, updateUser } from "../controller/userController";
import { authValidation } from "../middleware/userValidation";
import { verifyToken } from "../middleware/authorization";

const router = Router()

router.post(`/`, createUser)
router.get(`/`, [verifyToken],readUser)
router.put(`/:id`, [verifyToken], updateUser)
router.delete(`/:id`, [verifyToken], deleteUser)
router.post(`/auth`, [authValidation], authentication)

export default router