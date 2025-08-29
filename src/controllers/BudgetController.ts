import type { Request, Response } from 'express';

export class BudgetController {

    static getAll = async (req: Request, res: Response) => {
        console.log('Desde /api/budgets');

    }
    static create = async (req: Request, res: Response) => {
        console.log('Desde POST /api/budgets');

    }
     static getById = async (req: Request, res: Response) => {
        console.log('Desde Get by ID  /api/budgets');

    }
    static updateById = async (req: Request, res: Response) => {
        console.log('Desde Update by ID /api/budgets');

    }
    static deleteById = async (req: Request, res: Response) => {
        console.log('Desde delete by ID /api/budgets');

    }
}