import { Router } from "express";
import { createValidation, updateValidation } from "../middleware/supllierValidation";
import { createSupllier, deleteSupplier, readSupplier, updateSupplier } from "../controller/supplierController";

const router = Router()

router.post(`/`, [createValidation], createSupllier)
router.get(`/`, readSupplier)
router.put(`/:search`, [updateValidation], updateSupplier)
router.delete(`/:search`, deleteSupplier)

export default router