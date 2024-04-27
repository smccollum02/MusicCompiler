const mysql = require('mysql2');

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "dh&&bhcSAM#3",
    database: "MUSIC_HUB" 
})

db.connect()

async function executeQuery (query, callback) {
    const [rows] = await db.promise().query(query)
    callback(rows)
}

module.exports = {executeQuery}