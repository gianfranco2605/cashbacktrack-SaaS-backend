import express from 'express' 
import colors from 'colors'
import morgan from 'morgan'
import { db } from './config/db'
import budgetRouter from './routes/budgetRouter';
import authRouter from './routes/authRouter'

async function connectDB() {
    try {
        await db.authenticate();
        await db.sync()  // This will create tables and syncronice the models with the database
        console.log(colors.blue.bold('Database connected...'.cyan.underline));
        
    } catch (error) {
        console.error('Unable to connect to the database:', error);
        
    }
}

connectDB();

const app = express();

app.use(morgan('dev'));

app.use(express.json());

app.use('/api/budgets', budgetRouter);
app.use('/api/auth', authRouter);

export default app