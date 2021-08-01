const Client = require('./client/Client.js');
const config = require('./config/secret');
const client = new Client(config);
client.start();