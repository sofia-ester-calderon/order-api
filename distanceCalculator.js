const distance = require('google-distance-matrix');
const API_KEY = 'AIzaSyBOtLUbjZCRAiFBc6bReP8hd3KBU_pOPuY';


function getDistanceFromCoordinates(originLong, originLat, destLong, destLat) {
    return new Promise((resolve, reject) => {
        let origins = [];
        origins.push(originLat + ',' + originLong);
        let destinations = [];
        destinations.push(destLat + ',' + destLong);
        
        distance.key(API_KEY);
        distance.matrix(origins, destinations, (err, distances) => {
            if (err || !distances || distances.status != 'OK') {                
                reject(new Error('Error fetching distances from Google'));
                return;
            }
            if (distances.rows[0].elements[0].status == 'OK') {
                resolve(distances.rows[0].elements[0].distance.value);
            } else {
                reject(new Error('The destination is not reachable by land', distances.rows[0].elements[0].status));
            }
        })
    });
}

module.exports.getDistanceFromCoordinates = getDistanceFromCoordinates;