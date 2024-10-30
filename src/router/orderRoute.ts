import { Router } from "express";
import { createOrder, deleteOrder, readOrder, updateOrder } from "../controller/orderController";

const router = Router()

router.post(`/`, [], createOrder)
router.get(`/`, [], readOrder)
router.put(`/:id`, [], updateOrder)
router.delete(`/:id`, [], deleteOrder)

export default router