import type { Request, Response } from 'express';
import User from '../models/User';
import { hashPassword } from '../utils/auth';
import { generateToken } from '../utils/token';

export class AuthController {

    static createAccount = async (req: Request, res: Response) => {

        const{ email, password } = req.body

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
            res.json('Account created');

        } catch (error) {
            //console.log(error)
            res.status(500).json({error: 'there was an error'})
        }
    }
}
