import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import { User } from '../models/user';
import { BadRequestError } from '../errors/bad-request-error';
import jwt from 'jsonwebtoken';
import { validateRequest } from '../middleware/validate-request';

const router = express.Router();

router.post('/api/users/signup', [
    body('email').isEmail().withMessage('Email must be valid'),
    body('password').trim().isLength({ min: 4, max: 20 }).withMessage('Password must be between 4 and 20 characters')
], validateRequest, async (req: Request, res: Response) => {
    const { email, password } = req.body;

    const exisitingUser = await User.findOne({ email });

    if(exisitingUser) {
        throw new BadRequestError('Email already in use');
    }

    const user = User.build({ email, password });
    await user.save();
    console.log(process.env.JWT_KEY)

    const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_KEY!);

    req.session =  {
        jwt: token
    };
    
   res.status(201).send(user);
});

export { router as signupRouter };