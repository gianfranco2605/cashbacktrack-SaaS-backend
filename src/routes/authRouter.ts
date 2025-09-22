import { Router } from "express";
import { AuthController } from '../controllers/AuthController'
import { body } from "express-validator";
import { handleInputErrors } from "../middleware/validation";

const router = Router();

router.post('/create-account',
    body('name')
    .notEmpty().withMessage('Name cant be empty'),
    body('password')
    .notEmpty().withMessage('Paswword to short'),
    body('email')
    .notEmpty().withMessage('E-mail not valid'),
    handleInputErrors,
    AuthController.createAccount
);


export default router;