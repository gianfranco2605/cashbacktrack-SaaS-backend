import { Router } from "express";
import { AuthController } from '../controllers/AuthController'
import { body, param } from "express-validator";
import { handleInputErrors } from '../middleware/validation';
import { limiter } from "../config/limiter";
import { authenticate } from "../middleware/suth";

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

router.post('/forgot-password',
    body('email')
    .isEmail().withMessage('E-mail not valid'),
    handleInputErrors,
    AuthController.forgotPassword
    
)

router.post('/validate-token',
    body('token')
        .notEmpty().withMessage('Token cant be empty')
        .isLength({ min:6, max:6}).withMessage('Token must be 6 characters'),
        handleInputErrors,
        AuthController.validateToken
)

router.post('/reset-password/:token',
    param('token')
        .notEmpty()
        .isLength({ min: 6, max: 6 })
        .withMessage('Token not valid'),
        body('password')
        .isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
        handleInputErrors,
        AuthController.resetPasswordWithToken
);

router.get('/user',
    authenticate,
    AuthController.user
)

export default router;