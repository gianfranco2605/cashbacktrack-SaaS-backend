import { NextFunction, Request, Response } from "express";
import { body, param, validationResult } from "express-validator";

export const validateExpenseInput = async (req: Request, res: Response, next: NextFunction) => {

    await body('name')
        .notEmpty().withMessage('Name is required').run(req);
        
    await body('amount')
        .notEmpty().withMessage('Expense is required')
        .isNumeric().withMessage('Expense must be a number')
        .custom((value) => value > 0).withMessage('Expense must be greater than zero').run(req);

    
    next();
}