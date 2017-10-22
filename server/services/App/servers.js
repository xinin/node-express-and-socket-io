const express = require('express');
const cluster = require('cluster');
const net = require('net');
const sio = require('socket.io');
const sio_redis = require('socket.io-redis');
const farmhash = require('farmhash');

const compression = require('compression');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');

const App = require(__dirname + '/index');
const config = App.Config();
const setup = require(__dirname + '/setup');

const port = config.app.port;
const ip = config.app.ip;
const num_processes = config.numCPUs || require('os').cpus().length;
const workers = [];


const app = new express();
app.use(helmet.hidePoweredBy({ setTo: 'PHP 5.2.0' }));  // hidePoweredBy to remove the X-Powered-By header
app.use(helmet.hsts({ maxAge: 7776000000 }));           // hsts for HTTP Strict Transport Security
app.use(helmet.ieNoOpen());                             // ieNoOpen sets X-Download-Options for IE8+
app.use(helmet.noCache());                              // noCache to disable client-side caching
app.use(helmet.noSniff());                              // noSniff to keep clients from sniffing the MIME type
app.use(helmet.frameguard());                           // frameguard to prevent clickjacking
app.use(helmet.xssFilter());                            // xssFilter adds some small XSS protections
app.use(compression());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json({ limit: '10mb' }));
app.use(methodOverride());
app.use(cookieParser());
require(__dirname + '/routes')(app);
let server = require('http').createServer(app);
server.listen(port, ip, () => {
    console.log(`API Skalia up on ${ip}:${port}`);
});

