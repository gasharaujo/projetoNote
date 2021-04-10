const mysql = require('mysql');
const db = mysql.createConnection({
    host : 'localhost',
    user : 'node',
    password : 'node123',
    port: 3306,
    database : 'pastelaria',
    multipleStatements: true
});

// Conecta BD
db.connect((erro) => {
    if(erro){
        throw erro;
    }
    console.log(`connect`);
});

global.db = db;
module.exports = db;