import { Router } from "express";
import { AuthController } from '../controllers/AuthController'
import { body } from "express-validator";
import { handleInputErrors } from '../middleware/validation';
import { limiter } from "../config/limiter";

const router = Router();

router.use(limiter);

router.post('/create-account',
    body('name')
    .notEmpty().withMessage('Name cant be empty'),
    body('password')
    .isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
    body('email')
    .isEmail().withMessage('E-mail not valid'),
    handleInputErrors,
    AuthController.createAccount
);

router.post('/confirm-account',
    body('token')
    .notEmpty().withMessage('Token cant be empty')
    .isLength({ min:6, max:6}).withMessage('Token must be 6 characters'),
    handleInputErrors,
    AuthController.confirmAccount
)

router.post('/login',
    body('email')
    .isEmail().withMessage('E-mail not valid'),
    body('password')
    .notEmpty().withMessage('Password cant be empty'),
    handleInputErrors,
    AuthController.login
)
export default router;