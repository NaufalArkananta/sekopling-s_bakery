import { Router } from "express";
import { createSupply, deleteSupply, readSupply, updateSupply } from "../controller/supplyController";

const router = Router()

router.post(`/`, [], createSupply)
router.get(`/`, [], readSupply)
router.put(`/:id`, [], updateSupply)
router.delete(`/:id`, [], deleteSupply)

export default router