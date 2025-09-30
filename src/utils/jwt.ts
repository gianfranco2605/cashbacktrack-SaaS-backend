import jwt from 'jsonwebtoken'

export const generateJWT = (id: string): string => {

    const token = jwt.sign({id}, process.env.JSW_SECRET, 
        {expiresIn: '30d'}
    )

    return token;
}
