const path = require('path');

global.APP_ROOT = path.resolve(__dirname);

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const {
    handleCacheGet,
    handleCachePost,
    handleCacheFileGet,
} = require('./app/express');

const PORT = 8000;

const app = express();

const whitelist = process.env.CORS_WHITELIST ? JSON.parse(process.env.CORS_WHITELIST) : [
    'http://localhost:3000',
];

const corsOptions = {
    origin: (origin, callback) => {
        if (!origin || whitelist.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
};

app.use(bodyParser.json());
app.use(cors(corsOptions));
// app.options('*', cors(corsOptions));

app.listen(PORT, () => {
    console.info(`[express] Server is running on PORT ${PORT}`);
});

app.get('/cache/', handleCacheGet);
app.post('/cache/', handleCachePost);
app.get('/cache-file/', handleCacheFileGet);

app.use((err, _, res, next) => {
    if (res.headersSent) {
        return next(err);
    }

    console.error('[express] Some error occurred');
    console.error(err);
    res.status(500).send({
        message: 'Some error occurred',
    });
});
