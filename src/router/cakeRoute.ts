import { Router } from "express";
import { createCake, deleteCake, readCake, updateCake } from "../controller/cakeController";
import { uploadCakeImage } from "../middleware/uploudCakeImage";
import { createValidation, updateValidation } from "../middleware/cakeValidation";
import { verifyToken } from "../middleware/authorization";

const router = Router();

router.post(`/`,[verifyToken, uploadCakeImage.single(`cake_image`), createValidation], createCake);
router.get(`/`, [verifyToken], readCake)
router.put(`/:id`, [verifyToken, updateValidation, uploadCakeImage.single(`cake_image`)], updateCake)
router.delete(`/:id`, [verifyToken], deleteCake)

export default router;