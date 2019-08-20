const express = require('express');
const validator = require('./validator');
const dbCommunicator = require('./dbCommunicator');

let router = express.Router();

let errorResponder = function(res, err) {
    res.status(err.status || 400).send({'error': err.message});
}

router.patch('/:id', function(req, res) {
    let orderId = validator.validateIntParameter(req.params.id, res);

    dbCommunicator.takeOrder(parseInt(orderId))
        .then(status => res.send({'status': status}))
        .catch(err => errorResponder(res, err));
});

router.post('/', function(req, res) {
    let originLang = validator.validateFloatParameter(req.body.origin[0], res);
    let originLon = validator.validateFloatParameter(req.body.origin[1], res);
    let destLat = validator.validateFloatParameter(req.body.destination[0], res);
    let destLon = validator.validateFloatParameter(req.body.destination[1], res);

    validator.validateCoordinateParams(originLon, originLang, destLon, destLat, res)
    
    dbCommunicator.insertNewOrder(originLon, originLang, destLon, destLat)
        .then(newOrder => res.send(newOrder))
        .catch(err => errorResponder(res, err));
});

router.get('/', function(req, res) {
    let page = validator.validateIntParameter(req.query.page, res);
    let limit = validator.validateIntParameter(req.query.limit, res);

    dbCommunicator.getOrders(--page, limit)
        .then(orders => res.send(orders))
        .catch(err => errorResponder(res, err)); 
});

module.exports = router;