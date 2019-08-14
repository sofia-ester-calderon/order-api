const express = require('express');
const logger = require('./logger');
const dbCommunicator = require('./dbCommunication');


const app = express();

app.use(express.json());
app.use(logger);

app.patch('/orders/:id', (req, res) => {
    dbCommunicator.takeOrder(parseInt(req.params.id))
        .then(status => res.send({"status": status}))
        .catch(err => res.status(400).send({"error": err.message}));
});

app.get('/orders', (req, res) => {
    console.log(req.query);
    dbCommunicator.getOrders(req.query.page, req.query.limit)
        .then(orders => res.send(orders))
        .catch(err => res.status(400).send({"error": err.message}));    
});

app.post('/orders', (req, res) => {
    dbCommunicator.insertNewOrder(req.body.origin[0], req.body.origin[1], req.body.destination[0], req.body.destination[1])
        .then(newOrder => res.send(newOrder))
        .catch(err => res.status(400).send({"error": err.message}));
    });

app.listen(8080, () => console.log('Listening on Port 8080'));