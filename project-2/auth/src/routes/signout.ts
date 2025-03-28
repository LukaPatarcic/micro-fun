import express from 'express';

const router = express.Router();

router.post('/api/users/signout', (req, res) => {
    res.send('Hi user');
});

export { router as signoutRouter };