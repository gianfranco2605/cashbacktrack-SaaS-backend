import type { Request, Response } from 'express';
import Budget from '../models/Budget';
import Expense from '../models/Expenses';

export class BudgetController {

    static getAll = async (req: Request, res: Response) => {
        try {
            const budgets = await Budget.findAll({
                order: [
                    ['createdAt', 'DESC']
                ],
                //TODO:FILTER BY USER
            });
            res.json(budgets);
        } catch (error) {
            //console.log(error);
            res.status(500).json({ error: 'Error interno del servidor' });
        }

    }
    static create = async (req: Request, res: Response) => {
        try {
            const budget = new Budget(req.body);

            await budget.save();
            res.status(201).json({
                message: 'Presupuesto creado exitosamente',
                budget: budget
            });

        } catch (error) {
            //console.log(error);
            res.status(500).json({ error: 'Error interno del servidor' });

        }

    }
    static getById = async (req: Request, res: Response) => {

        const budget = await Budget.findByPk(req.budget.id, {
            include: [Expense]
        });
        res.json(budget);


    }
    static updateById = async (req: Request, res: Response) => {

        await req.budget.update(req.body);

        res.json({
            message: 'Presupuesto actualizado exitosamente',
            budget: req.budget
        });

    }
    static deleteById = async (req: Request, res: Response) => {

        await req.budget.destroy();

        res.json("Presupuesto eliminado exitosamente");

    }
}