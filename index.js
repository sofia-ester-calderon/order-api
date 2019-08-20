const express = require('express');
const router = require('./router');

const app = express();

app.use(express.json());
app.use('/orders', router);

app.listen(8080, () => console.log('Listening on Port 8080'));