import { Router } from "express";
import { createMaterial, deleteMaterial, readMaterial, updateMaterial } from "../controller/materialController";
import { createValidation, updateValidation } from "../middleware/materialvalidation";

const router = Router()

router.post(`/`, [createValidation], createMaterial)
router.get(`/`, readMaterial)
router.put(`/:id`, [updateValidation], updateMaterial)
router.delete(`/:id`, deleteMaterial)

export default router