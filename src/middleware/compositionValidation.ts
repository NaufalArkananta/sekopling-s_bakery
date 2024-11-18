import { NextFunction, Request, Response } from "express";
import Joi from "joi";

// create a rule/schema for adding new medicine

const detailSchema = Joi.object({
    material_id: Joi.number().required(),
    quantity: Joi.number().min(1).required()
})

const createSchema = Joi.object({
    cake_id: Joi.number().required(),
    composition: Joi.array().items(detailSchema).min(1).required()
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
    cake_id: Joi.number().optional(),
    composition: Joi.array().items(detailSchema).min(1).optional()
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

export { createValidation, updateValidation };