const mysql = require('mysql');
const distanceCalculator = require('./distanceCalculator');

const pool = mysql.createPool({
    connectionLimit : 100,
    host     : 'localhost',
    user     : 'root',
    password : 'Groucho#90',
    database : 'lalamove_orders',
    debug    :  false
});

const orderStatus = ['UNASSIGNED', 'SUCCESS', 'TAKEN'];
const tableName = "orders";
let lockedIds = [];

function insertNewOrder(originLat, originLong, destLat, destLong) {
    return distanceCalculator.getDistanceFromCoordinates(originLat, originLong, destLat, destLong).then(distance => {
        let insertQuery = "INSERT INTO ?? (??, ??) VALUES (?, ?)";
        let query = mysql.format(insertQuery,[tableName,"distance", "status", distance, orderStatus[0]]);
        return processQuery(query).then(response => {
            return getOrder(response.insertId).then(newOrder => {
                return newOrder;
            })
        }) 
    })
}

function takeOrder(id) {
    if(lockedIds.includes(id)) {
        return new Promise((resolve, reject) => {
            resolve(orderStatus[2]);
        });
    }
    else {
        lockedIds.push(id);
    }
    let status = orderStatus[1];
    let updateQuery = "UPDATE ?? SET ?? = ? WHERE ?? = ?";
    let query = mysql.format(updateQuery,[tableName, "status", status, "id", id])
    return processQuery(query).then(response => {
        return status;
    })
}

function getOrders(page, limit) {
    console.log(page)
    console.log(parseInt(page))
    let selectQuery = 'SELECT * FROM ?? LIMIT ?,?'
    let query = mysql.format(selectQuery, [tableName, parseInt(page), parseInt(limit)]);
    console.log(query)
    return processQuery(query).then(response => {
        return response;
    })
}

function getOrder(id) {
    let selectQuery = 'SELECT * FROM ?? WHERE ?? = ?';
    let query = mysql.format(selectQuery, [tableName, "id", id])
    return processQuery(query).then(response => {
        return response[0]}) 
}

function processQuery(query) {
    return new Promise((resolve, reject) => {
        pool.query(query,(err, data) => {
            if (err) {
                console.log(err);
                reject(new Error('Error processing query'));
            }
            resolve(data);
        })
    })
}

module.exports.insertNewOrder = insertNewOrder;
module.exports.takeOrder = takeOrder;
module.exports.getOrders = getOrders;
