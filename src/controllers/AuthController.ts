import type { Request, Response } from 'express';
import User from '../models/User';
import { hashPassword } from '../utils/auth';
import { generateToken } from '../utils/token';
import { AuthEmail } from '../emails/AuthEmail';

export class AuthController {

    static createAccount = async (req: Request, res: Response) => {

        const{ name, email, password } = req.body

        const userExist = await User.findOne({where: {email}})

        if(userExist) {
            const error = new Error('User already exist')
            return res.status(409).json({error: error.message})
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
            res.status(500).json({error: 'there was an error'})
        }
    }

    static confirmAccount = async (req: Request, res: Response) => {

        const {token} = req.body;
        const user = await User.findOne({where: {token}})
        console.log(user);
        
        if(!user) {
            const error = new Error('Token not valid');
            return res.status(401).json({error: error.message})
        }

        user.confirmed = true;

        user.token = null;
        await user.save();

        res.json("Account confirmed")
    }
}
