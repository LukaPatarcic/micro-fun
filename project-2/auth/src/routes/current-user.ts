import express from 'express';
import { currentUser } from '../middleware/current-user';
import { requireAuth } from '../middleware/require-auth';

const router = express.Router();

router.get('/api/users/currentUser', currentUser, requireAuth, (req, res) => {
    res.send({ currentUser: req.currentUser });
});

export { router as currentUserRouter };