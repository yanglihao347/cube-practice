const env = process.env.NODE_ENV;

let MYSQL_CONF = null;
let REDIS_CONF = null;

if (env === 'dev') {
  MYSQL_CONF = {
    host: '',
    user: '',
    password: '',
    port: '',
    database: '',
  };
  REDIS_CONF = {
    host: '',
    port: 6379,
  };
}

if (env === 'prod') {
  MYSQL_CONF = {
    host: '',
    user: '',
    password: '',
    port: '',
    database: '',
    useConnectionPooling: true,
  };
  REDIS_CONF = {
    host: '',
    port: 6379,
  };
}

module.exports = {
  MYSQL_CONF,
  REDIS_CONF,
};
