const mysql = require('mysql');
const { MYSQL_CONF } = require('./config');

console.log(MYSQL_CONF, '=======');

let exec = function() {};

function reconnect() {
    const con = mysql.createConnection(MYSQL_CONF);

    con.connect(function(err) {
        if(err) {
            console.error(err,'db连接失败。');
            return;
        }
        console.log('db连接成功');
    });

    exec = (sql) => {
        const promise = new Promise((resolve, reject) => {
            con.query(sql, (err, result) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve(result);
            })
        })
        return promise;
    }

    con.on('error', function(err) {
        if (err.code === 'PROTOCOL_CONNECTION_LOST') {
            console.error('db error重连中。。。');
            reconnect();
        } else if (err.code === 'PROTOCOL_ENQUEUE_AFTER_FATAL_ERROR') {
            console.error('fatal error 重连中。。。');
            reconnect();
        } else {
            console.error('else error 重连中。。。');
            reconnect();
        }
    })
}

reconnect();
// con.end();

module.exports = {
    exec,
    escape: mysql.escape
}

