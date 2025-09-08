import type { Request, Response } from 'express'
import Expense from '../models/Expenses';

export class ExpensesController {
    static getAll = async (req: Request, res: Response) => {

    }

    static create = async (req: Request, res: Response) => {

        try {

            const expense = new Expense(req.body);
            expense.budgetid = req.budget.id;
            await expense.save();
            res.status(201).json('Expense add')
            
        } catch (error) {
           //console.log(error);
           res.status(500).json({error: 'There was an error'});
            
        }

    }

    static getById = async (req: Request, res: Response) => {

    }

    static updateById = async (req: Request, res: Response) => {

    }

    static deleteById = async (req: Request, res: Response) => {

    }
}