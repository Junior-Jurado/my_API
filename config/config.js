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
    'host': 'ec2-44-213-151-75.compute-1.amazonaws.com',
    'port': 5432,
    'database':'d3govvltg5de2a',
    'user': 'mkqffxyekrbckg',
    'password': '12cd12c4738f6bd9d8b2a20c8d29470b88db4068e38fb0439d3dc6d03e10d992',
    'ssl': { rejectUnauthorized: false }
};

const db = pgp(databaseConfig);

module.exports = db;