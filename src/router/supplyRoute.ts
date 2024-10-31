import { Router } from "express";
import { createSupply, deleteSupply, readSupply, updateSupply } from "../controller/supplyController";
import { verifyToken } from "../middleware/authorization";

const router = Router()

router.post(`/`, [verifyToken], createSupply)
router.get(`/`, [verifyToken], readSupply)
router.put(`/:id`, [verifyToken], updateSupply)
router.delete(`/:id`, [verifyToken], deleteSupply)

export default router