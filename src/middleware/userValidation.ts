import { NextFunction, Request, Response } from "express";
import Joi from "joi";

const createSchema = Joi.object({
    username: Joi.string().required(),
    user_email: Joi.string().required(),
    user_password: Joi.string().required(),
    user_role: Joi.string().valid("ADMIN", "CASHIER").required(),
});

const createValidation = (req: Request, res: Response, next: NextFunction): void => {
    const validate = createSchema.validate(req.body, { abortEarly: false }); // To get all errors
    if (validate.error) {
        res.status(400).json({
            message: validate.error.details.map(it => it.message).join(", "), // Error messages separated by comma
        });
        return
    }
    next();
}

// update a rule/schema for adding new medicine
const updateSchema = Joi.object({
    username: Joi.string().optional(),
    user_email: Joi.string().optional(),
    user_password: Joi.string().optional(),
    user_role: Joi.string().valid("ADMIN", "CASHIER").optional(),
});

const updateValidation = (req: Request, res: Response, next: NextFunction): void => {
    const validate = updateSchema.validate(req.body, { abortEarly: false }); // To get all errors
    if (validate.error) {
        res.status(400).json({
            message: validate.error.details.map(it => it.message).join(", "), // Error messages separated by comma
        });
        return
    }
    next();
};

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

export { authValidation, createValidation, updateValidation };