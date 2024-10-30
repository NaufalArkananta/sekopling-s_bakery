import { NextFunction, Request, Response } from "express";
import Joi from "joi";

// create a rule/schema for adding new medicine
const createSchema = Joi.object({
    material_name: Joi.string().required(),
    material_price: Joi.number().required(),
    material_type: Joi.string().valid("LIQUID", "POWDER", "SOLID").required()
});

const createValidation = (req: Request, res: Response, next: NextFunction): void => {
    const validate = createSchema.validate(req.body, { abortEarly: false }); // To get all errors
    if (validate.error) {
        res.status(400).json({
            message: validate.error.details.map(it => it.message).join(", "), // Error messages separated by comma
        });
    }
    next();
}

// update a rule/schema for adding new medicine
const updateSchema = Joi.object({
    material_name: Joi.string().optional(),
    material_price: Joi.number().optional(),
    material_type: Joi.string().valid("LIQUID", "POWDER", "SOLID").optional()
});

const updateValidation = (req: Request, res: Response, next: NextFunction): void => {
    const validate = updateSchema.validate(req.body, { abortEarly: false }); // To get all errors
    if (validate.error) {
        res.status(400).json({
            message: validate.error.details.map(it => it.message).join(", "), // Error messages separated by comma
        });
    }
    next();
};

export { createValidation, updateValidation };