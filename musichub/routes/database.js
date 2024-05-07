const mysql = require('mysql2');

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "dh&&bhcSAM#3",
    database: "MUSIC_HUB" 
})

db.connect()

async function executeQuery (query) {
    const [rows] = await db.promise().query(query)
    return rows
}

async function executeQueryGetID (query) {
    await db.promise().query(query)
    const [insertIDRes] = await db.promise().query("SELECT LAST_INSERT_ID();")
    return insertIDRes[0]["LAST_INSERT_ID()"]
}

async function getID (query) {
    const [id] = await db.promise().query(query)
    return id ? id[0] ? id[0].ID ? id[0].ID : 0 : 0 : 0
}

module.exports = {executeQuery, executeQueryGetID, getID}