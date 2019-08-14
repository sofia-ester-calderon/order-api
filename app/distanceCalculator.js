const distance = require('google-distance-matrix');
const isValidCoordinates = require('is-valid-coordinates');

const key = 'AIzaSyBOtLUbjZCRAiFBc6bReP8hd3KBU_pOPuY';


function getDistanceFromCoordinates(originLat, originLong, destLat, destLong) {
    
    
    return new Promise((resolve, reject) => {
            resolve(80000)
      /*  if (!isValidCoordinates(parseInt(originLong), parseInt(originLat)) || !isValidCoordinates(parseInt(destLong), parseInt(destLat))) {
            reject(new Error('Wrong longitude or latitude value'));
            return
        }
        let origins = [];
        origins.push(originLat + ',' + originLong);
        let destinations = [];
        destinations.push(destLat + ',' + destLong);
        
        distance.key('AIzaSyBqhNi5_m3IQr3McCX6HYXNcpI753eFa7w');
        distance.matrix(origins, destinations, (err, distances) => {
            if (err || !distances || distances.status != 'OK') {
                reject(new Error('Error fetching distances from Google'));
                return;
            }
            if (distances.rows[0].elements[0].status == 'OK') {
                console.log("REQUEST FROM GOOGLE OK");
                resolve(distances.rows[0].elements[0].distance.text);
            } else {
                reject(new Error('The destination is not reachable by land'));
            }
        })*/
    });
}

module.exports.getDistanceFromCoordinates = getDistanceFromCoordinates;