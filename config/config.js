const promise = require("bluebird")
const options = {
    promiseLib: promise,
    query: (e) =>{}
}
const https = require('https');

// Opción para deshabilitar la validación del certificado
const httpsAgent = new https.Agent({
  rejectUnauthorized: false
});

const pgp = require('pg-promise')(options);
const types = pgp.pg.types;
types.setTypeParser(1114, function(stringValue){
    return stringValue;
});

const databaseConfig = {
    'host': 'ec2-54-86-180-157.compute-1.amazonaws.com',
    'port': 5432,
    'database':'d7o1ig7buerp0e',
    'user': 'jpgakxruhdbwhz',
    'password': '075fd109de652ddd1e9af79358d35845f0d52fbff8982c668109dbbc165a30cc',
    'ssl': { rejectUnauthorized: false }
};

const db = pgp(databaseConfig);

module.exports = db;