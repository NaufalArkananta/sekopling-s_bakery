import { Router } from "express";
import { createMaterial, deleteMaterial, readMaterial, updateMaterial } from "../controller/materialController";
import { createValidation, updateValidation } from "../middleware/materialvalidation";
import { verifyToken } from "../middleware/authorization";

const router = Router()

router.post(`/`, [verifyToken, createValidation], createMaterial)
router.get(`/`, [verifyToken], readMaterial)
router.put(`/:id`, [verifyToken, updateValidation], updateMaterial)
router.delete(`/:id`, [verifyToken], deleteMaterial)

export default router