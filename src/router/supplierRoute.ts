import { Router } from "express";
import { createValidation, updateValidation } from "../middleware/supllierValidation";
import { createSupllier, deleteSupplier, readSupplier, updateSupplier } from "../controller/supplierController";
import { verifyToken } from "../middleware/authorization";

const router = Router()

router.post(`/`, [createValidation, verifyToken], createSupllier)
router.get(`/`, [verifyToken],readSupplier)
router.put(`/:search`, [updateValidation, verifyToken], updateSupplier)
router.delete(`/:search`, [verifyToken], deleteSupplier)

export default router