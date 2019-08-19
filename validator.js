const isValidCoordinates = require('is-valid-coordinates');

let errorResponder = function(res, param) {
    res.status(400).send({'error': 'Wrong parameter ' + param});
}

function validateIntParameter(param, res) {
    let value = parseInt(param, res);
    if (!value) {
        errorResponder(res);
        return;
    }
    return value;
}

function validateFloatParameter(param, res) {
    let value = parseFloat(param, res);
    if (!value) {
        errorResponder(res);
        return;
    }
    return value;
}

function validateCoordinateParams(originLong, originLat, destLong, destLat, res) {
    if (!isValidCoordinates(originLong, originLat) || !isValidCoordinates(destLong, destLat)) {
        errorResponder(res);
    }
}
  
module.exports.validateIntParameter = validateIntParameter;
module.exports.validateFloatParameter = validateFloatParameter;
module.exports.validateCoordinateParams = validateCoordinateParams;