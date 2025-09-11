import { NextFunction, Request, Response } from "express";
import { body, param, validationResult } from "express-validator";
import Expense from "../models/Expenses";

declare global {
    namespace Express {
        interface Request {
            expense?: Expense
        }
    }
}

export const validateExpenseInput = async (req: Request, res: Response, next: NextFunction) => {

    await body('name')
        .notEmpty().withMessage('Name is required').run(req);
        
    await body('amount')
        .notEmpty().withMessage('Expense is required')
        .isNumeric().withMessage('Expense must be a number')
        .custom((value) => value > 0).withMessage('Expense must be greater than zero').run(req);
    
    next();
}

export const validateExpenseId = async (req: Request, res: Response, next: NextFunction) => {

    await param('expenseId').isInt().custom( value => value > 0 ).withMessage('ID non valid').run(req);

    let errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
    }

    next();
}

export const validateExpenseExist = async (req: Request, res: Response, next: NextFunction) => {

    try {
        const { expenseId } = req.params;

        const expense = await Expense.findByPk(expenseId);

        if (!expense) {
            const error = new Error('Gasto no encontrado');
            return res.status(404).json({ error: error.message });
        }

        req.expense = expense

        next();

    } catch (error) {
        //console.log(error);
        res.status(500).json({ error: 'Error interno del servidor' });

    }
}