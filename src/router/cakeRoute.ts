import { Router } from "express";
import { createCake, deleteCake, readCake, updateCake } from "../controller/cakeController";
import { uploadCakeImage } from "../middleware/uploudCakeImage";
import { createValidation, updateValidation } from "../middleware/cakeValidation";

const router = Router();

router.post(`/`,[uploadCakeImage.single(`cake_image`), createValidation], createCake);
router.get(`/`, readCake)
router.put(`/:id`, [updateValidation], updateCake)
router.delete(`/:id`, deleteCake)

export default router;