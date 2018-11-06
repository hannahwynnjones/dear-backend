const port = process.env.PORT || 4000;
const env = process.env.NODE_ENV || 'development';
const dbURI = process.env.MONGODB_URI || `mongodb://localhost/node-backend-template-${env}`;
const secret = process.env.SECRET || 'shh its a secret';

module.exports = { port, env, dbURI, secret };
