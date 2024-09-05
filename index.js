const express = require('express');
const app = express();

const rateLimiterMiddleware = require('./rateLimiterMiddleWare.js')
app.post('/', rateLimiterMiddleware, (req, res) => {
    res.send('Your POST request was successful.');
});


app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
