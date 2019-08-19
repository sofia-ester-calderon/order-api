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
let lockedIds = [];

async function insertNewOrder(originLong, originLat, destLong, destLat) {
    let distance = await distanceCalculator.getDistanceFromCoordinates(originLat, originLong, destLat, destLong);
    let insertQuery = 'INSERT INTO ?? (??, ??) VALUES (?, ?)';
    let query = mysql.format(insertQuery,[tableName, 'distance', 'status', distance, orderStatus[0]]);
    let queryAnswer = await processQuery(query);
    let newOrder = getOrder(queryAnswer.insertId);
    return newOrder;
}

async function takeOrder(id) {
    if (lockedIds.includes(id)) {
        return orderStatus[1];
    }
    else {
        lockedIds.push(id);
    }
    let order = await getOrder(id);
    if (!order) {
        throw new Error('Order not found');
    }
    if (order.status != orderStatus[1]) {
        return order.status;
    }

    let status = orderStatus[1];
    let updateQuery = 'UPDATE ?? SET ?? = ? WHERE ?? = ?';
    let query = mysql.format(updateQuery,[tableName, 'status', status, 'id', id]);
    await processQuery(query);
    lockedIds.splice(lockedIds.indexOf(id), 1);
    return 'SUCCESS';
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
                reject(new Error('Error processing query', err.message));
            }
            resolve(data);
        })
    })
}

module.exports.insertNewOrder = insertNewOrder;
module.exports.takeOrder = takeOrder;
module.exports.getOrders = getOrders;
