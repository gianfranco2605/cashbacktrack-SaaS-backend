import type { Request, Response } from 'express';
import User from '../models/User';
import { checkPassword, hashPassword } from '../utils/auth';
import { generateToken } from '../utils/token';
import { AuthEmail } from '../emails/AuthEmail';
import { generateJWT } from '../utils/jwt';
export class AuthController {

    static createAccount = async (req: Request, res: Response) => {

        const {  email, password } = req.body

        const userExist = await User.findOne({ where: { email } })

        if (userExist) {
            const error = new Error('User already exist')
            return res.status(409).json({ error: error.message })
        }

        try {

            const user = new User(req.body)
            user.password = await hashPassword(password);
            user.token = generateToken()
            await user.save();

            // Try to send email, but don't fail user creation if email fails
            try {
                await AuthEmail.sendConfirmationEmail({
                    name: user.name,
                    email: user.email,
                    token: user.token
                })
            } catch (emailError) {
                console.log('Email sending failed, but user was created:', emailError.message);
            }

            res.json('Account created');

        } catch (error) {
            console.log(error)
            res.status(500).json({ error: 'there was an error' })
        }
    }

    static confirmAccount = async (req: Request, res: Response) => {

        const { token } = req.body;
        const user = await User.findOne({ where: { token } })
        console.log(user);

        if (!user) {
            const error = new Error('Token not valid');
            return res.status(401).json({ error: error.message })
        }

        user.confirmed = true;

        user.token = null;
        await user.save();

        res.json("Account confirmed")
    }

    static login = async (req: Request, res: Response) => {

        const { email, password } = req.body

        const user = await User.findOne({ where: { email } })

        if (!user) {
            const error = new Error('User not found')
            return res.status(404).json({ error: error.message })
        }

        if (!user.confirmed) {
            const error = new Error('Account not confirmed')
            return res.status(403).json({ error: error.message })
        }

        const isPasswrodcorrect = await checkPassword(password, user.password)

        if (!isPasswrodcorrect) {
            const error = new Error('Password is incorrect')
            return res.status(401).json({ error: error.message })
        }

        const token = generateJWT(user.id)

        res.json(token)

    }

    static forgotPassword = async (req: Request, res: Response) => {

        const { email } = req.body

        const user = await User.findOne({ where: { email } })

        if (!user) {
            const error = new Error('User not found')
            return res.status(404).json({ error: error.message })
        }

        user.token = generateToken();

        await user.save();

        await AuthEmail.sendPasswordResetEmail({
            name: user.name,
            email: user.email,
            token: user.token
        })

        res.json('Check you email for a link to reset your password')

    }

    static validateToken = async (req: Request, res: Response) => {

        const { token } = req.body

        console.log(token);

        const tokenExist = await User.findOne({ where: { token } })

        if (!tokenExist) {
            const error = new Error('Token not valid');

            return res.status(409).json({ error: error.message });
        }

        res.json('Token is valid');

    }

    static resetPasswordWithToken = async (req: Request, res: Response) => {

        const { token } = req.params;

        const { password } = req.body;

        const user = await User.findOne({ where: { token } })
        if (!user) {
            const error = new Error('Token not valid');

            return res.status(404).json({ error: error.message });
        }

        user.password = await hashPassword(password);
        user.token = null;
        await user.save();

        res.json('Password reset successfully');
    }

    static user = async (req: Request, res: Response) => {
        res.json(req.user);
    }

}
