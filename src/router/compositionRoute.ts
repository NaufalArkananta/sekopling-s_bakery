import { Router } from "express";
import { createComposition, deleteComposition, readComposition, updateComposition } from "../controller/compositionController";
import { createValidation, updateValidation } from "../middleware/compositionValidation";

const router = Router()

router.post(`/`, [createValidation], createComposition)
router.get(`/`, readComposition)
router.put(`/:id`, [updateValidation], updateComposition)
router.delete(`/:id`, deleteComposition)

export default router