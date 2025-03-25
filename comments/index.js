import express from 'express';
import { randomBytes } from 'crypto';
import cors from 'cors';
import bodyParser from 'body-parser';
import axios from 'axios';
const app = express();

const commentsByPostId = {};

app.use(bodyParser.json());
app.use(cors());

app.get('/posts/:id/comments', (req, res) => {
    res.send(commentsByPostId[req.params.id] || []);
});

app.post('/posts/:id/comments', async (req, res) => {
    const commentId = randomBytes(4).toString('hex');
    const { content } = req.body;

    const comments = commentsByPostId[req.params.id] || [];
    const newComment = { id: commentId, postId: req.params.id, content, status: 'pending' };

    comments.push(newComment);
    commentsByPostId[req.params.id] = comments;

    await axios.post('http://localhost:4005/events', {
        type: 'CommentCreated',
        data: newComment
    });

    res.status(201).send(newComment);
});

app.post('/events', async (req, res) => {
    console.log('Received Event', req.body.type);
    const { type, data } = req.body;
    switch(type) {
        case 'CommentModerated': {
            const { id, postId, status } = data;
            const comments = commentsByPostId[postId];
            const comment = comments.find((comment) => comment.id === id);
            comment.status = status;
            console.log('comment', comment)
            await axios.post('http://localhost:4005/events', {
                type: 'CommentUpdated',
                data: {
                    id: comment.id,
                    postId: comment.postId,
                    status: comment.status,
                    content: comment.content,
                }
            });

            break;
        }
    }
    
    res.send({});
});

app.listen(4001, () => {
    console.log('Listening on 4001');
});
