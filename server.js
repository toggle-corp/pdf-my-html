const express = require('express');
const cors = require('cors');

const {
    handleGeneratePdf,
} = require('./app/express');

const PORT = 8000;

const app = express();

app.use(cors({
    origin: 'http://localhost:8081',
}));
app.listen(PORT, () => {
    console.info(`Server is running on PORT ${PORT}`);
});

app.get('/generate-pdf/', handleGeneratePdf);

app.use((err, req, res, next) => {
    if (res.headersSent) {
        return next(err);
    }

    console.error(err);
    res.status(500).send({
        message: 'Some error occurred',
    });
});
