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

app.use(bodyParser.json());
app.use(cors({
    origin: 'http://localhost:8081',
}));

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
