import { Router } from "express";
import { createOrder, deleteOrder, readOrder, updateOrder } from "../controller/orderController";
import { verifyToken } from "../middleware/authorization";

const router = Router()

router.post(`/`, [verifyToken], createOrder)
router.get(`/`, [verifyToken], readOrder)
router.put(`/:id`, [verifyToken], updateOrder)
router.delete(`/:id`, [verifyToken], deleteOrder)

export default router