import { transport } from "../config/nodemailer";

type EmailType = {
    name: string;
    email: string;
    token: string;
}

export class AuthEmail {
    static sendConfirmationEmail = async (user: EmailType) => {
        try {
            const email = await transport.sendMail({
                from: 'Cashtrackr <no-reply@cashtrackr.com>',
                to: user.email,
                subject: 'Cashtrackr - Confirm your account',
                html: `
                    <h1>Confirm your account: ${user.name}</h1>
                    <p>Click ${user.token} <a href="#">here</a> to confirm your account</p>
                `                
            }) 

            console.log('Email sent:', email);
            return email;
        } catch (error) {
            console.error('Error sending email:', error);
            throw error;
        }
    }
}