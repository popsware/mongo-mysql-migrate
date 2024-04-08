var mysql = require('mysql');
module.exports = function () {
    return mysql.createPool({
        connectionLimit: 100,
        host: 'localhost',
        user: process.env.MYSQL_USER,
        password: process.env.MYSQL_PASS,
        database: process.env.MYSQL_DBNAME,
        multipleStatements: true,
        Promise: global.Promise // or specific Promise implementation
    });
}