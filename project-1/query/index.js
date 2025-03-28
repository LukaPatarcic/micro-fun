import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import axios from 'axios';
const app = express();

const posts = {};

app.use(bodyParser.json());
app.use(cors());

const handleEvent = (type, data) => {
    switch(type) {
        case 'PostCreated': {
            const { id, title } = data;
            posts[id] = { id, title, comments: [] };
            break;
        }
        case 'CommentCreated': {
            const { id, content, status, postId } = data;
            const post = posts[postId];
            post.comments.push({ id, content, status, postId });
            break;
        }
        case 'CommentUpdated': {
            const { id, content, postId, status} = data;
            const post = posts[postId];
            const comment = post.comments.find(comment => comment.id === id);
            comment.status = status;
            comment.content = content;

            break;
        }
    }
}

app.get('/posts', (req, res) => {
    res.send(posts);
});

app.post('/events', (req, res) => {
    console.log('Received Event', req.body.type);
    const { type, data } = req.body;

    handleEvent(type, data);

    res.send({});
});

app.listen(4002, async () => {
    console.log('Listening on 4002');

    const res = await axios.get('http://event-bus-srv:4005/events');
    for (let event of res.data) {
        console.log('Processing event', event.type);
        handleEvent(event.type, event.data);
    }
});
