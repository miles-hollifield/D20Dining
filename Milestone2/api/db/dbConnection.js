const mariadb = require('mariadb');

const pool = mariadb.createPool({
    host: process.env.DB_HOST, 
    user: process.env.MARIADB_USER,
    password: process.env.MARIADB_PASS,
    port: process.env.DB_PORT,
    database: process.env.MARIADB_DATABASE,
    charset: process.env.DB_CHARSET
});


exports.query = (query, params = []) => {
    return new Promise((resolve, reject) => {
        pool.getConnection().then(conn => {
            conn.query(query, params)
                .then(results => {
                    resolve(results); // Directly resolve results
                    conn.release(); // Release connection back to pool
                })
                .catch(err => {
                    reject(err); // Reject with error
                    conn.release(); // Release connection even on error
                });
        }).catch(err => {
            reject(err); // Reject if getting connection fails
        });
    });
};

exports.close = () => {
    pool.end().then(() => {
        console.log('Pool closed');
    }).catch(err => {
        console.error('Error closing pool', err);
    });
};
