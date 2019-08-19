const express = require('express');
const logger = require('./logger');
const validator = require('./validator');
const dbCommunicator = require('./dbCommunication');

const app = express();

app.use(express.json());
app.use(logger);

const API_PREFIX = '/orders'

let errorResponder = function(res, err) {
    res.status(400).send({"error": err.message});
}

app.patch(API_PREFIX + '/:id', (req, res) => {
    let orderId = validator.validateIntParameter(req.params.id, res);

    dbCommunicator.takeOrder(parseInt(orderId))
        .then(status => res.send({"status": status}))
        .catch(err => errorResponder(res, err));
});

app.get(API_PREFIX, (req, res) => {
    let page = validator.validateIntParameter(req.query.page, res);
    let limit = validator.validateIntParameter(req.query.limit, res);

    dbCommunicator.getOrders(--page, limit)
        .then(orders => res.send(orders))
        .catch(err => errorResponder(res, err)); 
});

app.post(API_PREFIX, (req, res) => {
    let originLang = validator.validateFloatParameter(req.body.origin[0], res);
    let originLon = validator.validateFloatParameter(req.body.origin[1], res);
    let destLat = validator.validateFloatParameter(req.body.destination[0], res);
    let destLon = validator.validateFloatParameter(req.body.destination[1], res);

    validator.validateCoordinateParams(originLon, originLang, destLon, destLat, res)
    
    dbCommunicator.insertNewOrder(originLon, originLang, destLon, destLat)
        .then(newOrder => res.send(newOrder))
        .catch(err => errorResponder(res, err));
    });

app.listen(8080, () => console.log('Listening on Port 8080'));