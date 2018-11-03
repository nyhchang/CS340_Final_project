var mysql = require('mysql');
var pool = mysql.createPool({
  connectionLimit: 10,
  host: 'classmysql.engr.oregonstate.edu',
  user: 'cs340_changnat',
  password: '3183',
  database: 'cs340_changnat'
});
module.exports.pool = pool;