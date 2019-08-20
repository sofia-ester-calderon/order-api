const mysql = require('mysql');
const distanceCalculator = require('./distanceCalculator');

const pool = mysql.createPool({
    connectionLimit : 100,
    host     : 'mysql',
    user     : 'user',
    password : 'password',
    database : 'lalamove_db',
    debug    :  false
});

const orderStatus = ['UNASSIGNED', 'TAKEN'];
const tableName = 'orders';
let lockedOrderIds = [];

async function insertNewOrder(originLong, originLat, destLong, destLat) {
    let distance = await distanceCalculator.getDistanceFromCoordinates(originLat, originLong, destLat, destLong);
    let insertQuery = 'INSERT INTO ?? (??, ??) VALUES (?, ?)';
    let query = mysql.format(insertQuery,[tableName, 'distance', 'status', distance, orderStatus[0]]);
    let queryAnswer = await processQuery(query);
    let newOrder = getOrder(queryAnswer.insertId);
    return newOrder;
}

async function takeOrder(id) {
    if(isOrderLocked(id)) {
        return orderStatus[1];
    }
    lockOrder(id);

    let order = await getOrder(id);
    if (!order) {
        unlockOrder();
        throw {message: 'Order not found', status: 404};
    }
    if (order.status != orderStatus[0]) {
        return order.status;
    }

    let status = orderStatus[1];
    let updateQuery = 'UPDATE ?? SET ?? = ? WHERE ?? = ?';
    let query = mysql.format(updateQuery,[tableName, 'status', status, 'id', id]);
    await processQuery(query);
    unlockOrder(id);
    return 'SUCCESS';
}

function isOrderLocked(id) {
    if (lockedOrderIds.includes(id)) {
        return true;
    }
    return false;
}

function lockOrder(id) {
    if (!lockedOrderIds.includes(id)) {
        lockedOrderIds.push(id);
    }
}

function unlockOrder(id) {
    lockedOrderIds.splice(lockedOrderIds.indexOf(id), 1);
}

async function getOrders(page, limit) {
    let selectQuery = 'SELECT * FROM ?? LIMIT ?,?';
    let query = mysql.format(selectQuery, [tableName, page, limit]);
    let orderList = await processQuery(query);
    return orderList;
}

async function getOrder(id) {
    let selectQuery = 'SELECT * FROM ?? WHERE ?? = ?';
    let query = mysql.format(selectQuery, [tableName, 'id', id]);
    let order = await processQuery(query);
    return order[0];
}

function processQuery(query) {
    return new Promise((resolve, reject) => {
        pool.query(query,(err, data) => {
            if (err) {
                reject({message: 'Error processing query: ' + err.message, status: 500});
            }
            resolve(data);
        })
    })
}

module.exports.insertNewOrder = insertNewOrder;
module.exports.takeOrder = takeOrder;
module.exports.getOrders = getOrders;