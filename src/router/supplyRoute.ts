import { Router } from "express";
import { createSupply, deleteSupply, readSupply, updateSupply } from "../controller/supplyController";
import { verifyToken } from "../middleware/authorization";
import { createValidation, updateValidation } from "../middleware/supplyValidation";

const router = Router()

router.post(`/`, [verifyToken, createValidation], createSupply)
router.get(`/`, [verifyToken], readSupply)
router.put(`/:id`, [verifyToken, updateValidation], updateSupply)
router.delete(`/:id`, [verifyToken], deleteSupply)

export default router