import { NextFunction, Request, Response } from "express";
import Joi from "joi";

const authSchema = Joi.object({
    user_email: Joi.string().email().required(),
    user_password: Joi.string().min(8).required(),
})

const authValidation = (req: Request, res: Response, next: NextFunction): void => {
    const validate = authSchema.validate(req.body, { abortEarly: false }); // To get all errors
    if(validate.error) {
        res.status(400).json({
            message: validate.error.details.map(it => it.message).join(", ")
        })
    }
    next();
}

export { authValidation };