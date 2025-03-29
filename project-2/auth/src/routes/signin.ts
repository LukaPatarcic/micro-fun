import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import { validateRequest } from '../middleware/validate-request';
import { User } from '../models/user';
import { BadRequestError } from '../errors/bad-request-error';
import { Password } from '../services/password';
import jwt from 'jsonwebtoken';

const router = express.Router();

router.post('/api/users/signin', [
    body('email').isEmail().withMessage('Email must be valid'),
    body('password').trim().notEmpty().withMessage('You must supply a password'),
], validateRequest, async (req: Request, res: Response) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if(!user) {
        throw new BadRequestError('Email or password is not correct');
    }

    const isPasswordMatch = await Password.compare(user.password, password);

    if(!isPasswordMatch) {
        throw new BadRequestError('Email or password is not correct');
    }

    const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_KEY!);

    req.session =  {
        jwt: token
    };

    res.status(200).send(user);
});

export { router as signinRouter };