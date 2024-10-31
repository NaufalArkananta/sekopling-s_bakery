import { Router } from "express";
import { createComposition, deleteComposition, readComposition, updateComposition } from "../controller/compositionController";
import { createValidation, updateValidation } from "../middleware/compositionValidation";
import { verifyToken } from "../middleware/authorization";

const router = Router()

router.post(`/`, [verifyToken, createValidation], createComposition)
router.get(`/`, [verifyToken], readComposition)
router.put(`/:id`, [verifyToken], [updateValidation], updateComposition)
router.delete(`/:id`, [verifyToken], deleteComposition)

export default router