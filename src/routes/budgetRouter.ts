import { Router } from 'express';
import { body, param } from 'express-validator';
import { BudgetController } from '../controllers/BudgetController';
import { handleInputErrors } from '../middleware/validation';
import { validateBudgetExist, validateBudgetId, validateBudgetInput } from '../middleware/budget';
import { ExpensesController } from '../controllers/ExpensesController';
import { validateExpenseExist, validateExpenseId, validateExpenseInput } from '../middleware/expense';

const router = Router();

router.param('budgetId', validateBudgetId);
router.param('budgetId', validateBudgetExist);

router.param('expenseId', validateExpenseId)
router.param('expenseId', validateExpenseExist)

router.get('/', BudgetController.getAll);

router.post('/',
    validateBudgetInput,
    handleInputErrors,
    BudgetController.create);


router.get('/:budgetId',
    BudgetController.getById);

router.put('/:budgetId',
    //Middleware
    validateBudgetInput,
    handleInputErrors,
    BudgetController.updateById);

router.delete('/:budgetId',
    BudgetController.deleteById);


//Patron ROA
router.get('/:budgetId/expenses', ExpensesController.getAll);

router.post('/:budgetId/expenses',
    validateExpenseInput,
    handleInputErrors,
    ExpensesController.create);

router.get('/:budgetId/expenses/:expenseId', ExpensesController.getById);

router.put('/:budgetId/expenses/:expenseId', ExpensesController.updateById);

router.delete('/:budgetId/expenses/:expenseId', ExpensesController.deleteById);

export default router;