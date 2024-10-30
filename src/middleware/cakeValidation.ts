import { NextFunction, Request, Response } from "express";
import Joi from "joi";
import  path  from "path"
import { ROOT_DIRECTORY } from "../config"
import fs from "fs" 

// create a rule/schema for adding new medicine
const createSchema = Joi.object({
    cake_name: Joi.string().required(),
    cake_price: Joi.number().min(1).required(),
    best_before: Joi.date().required(),
    cake_flavour: Joi.string().required(),
});

const createValidation = (req: Request, res: Response, next: NextFunction): void => {
    const validate = createSchema.validate(req.body, { abortEarly: false }); // To get all errors
    if (validate.error) {
        let fileName: string = req.file?.filename || ``
        let pathFile = path.join(ROOT_DIRECTORY,"public", "cake-image", fileName)
        /** check file is exists*/
        let fileExists = fs.existsSync(pathFile)
        // apakah ada file yg dihapus
        if(fileExists && fileName !==``) {
            fs.unlinkSync(pathFile)
        }
        res.status(400).json({
            message: validate.error.details.map(it => it.message).join(", "), // Error messages separated by comma
        });
    }
    next();
}

// update a rule/schema for adding new medicine
const updateSchema = Joi.object({
    cake_name: Joi.string().optional(),
    cake_price: Joi.number().min(1).optional(),
    best_before: Joi.date().optional(),
    cake_flavour: Joi.string().optional(),
});

const updateValidation = (req: Request, res: Response, next: NextFunction): void => {
    const validate = updateSchema.validate(req.body, { abortEarly: false }); // To get all errors
    if (validate.error) {
        let fileName: string = req.file?.filename || ``
        let pathFile = path.join(ROOT_DIRECTORY,"public", "cake-image", fileName)
        /** check file is exists*/
        let fileExists = fs.existsSync(pathFile)
        // apakah ada file yg dihapus
        if(fileExists && fileName !==``) {
            fs.unlinkSync(pathFile)
        }
        res.status(400).json({
            message: validate.error.details.map(it => it.message).join(", "), // Error messages separated by comma
        });
    }
    next();
};

export { createValidation, updateValidation };