import express from 'express';
import bodyParser from 'body-parser';
import axios from 'axios';
const app = express();


app.use(bodyParser.json());

app.post('/events', async (req, res) => {
    console.log('Received Event', req.body.type);
    const { type, data } = req.body;
    switch(type) {
        case 'CommentCreated': {
            const status = data.content.includes('orange') ? 'rejected' : 'approved';
            console.log(status);
            await axios.post('http://localhost:4005/events', {
                type: 'CommentModerated',
                data: {
                    id: data.id,
                    postId: data.postId,
                    status,
                    content: data.content,
                }
            });
            break;
        }
    }
    res.send({});
});

app.listen(4003, () => {
    console.log('Listening on 4003');
});
