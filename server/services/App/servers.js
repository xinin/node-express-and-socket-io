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
const cors = require('cors');

const App = require(__dirname + '/index');
const config = App.Config();
const setup = require(__dirname + '/setup');

const port = config.app.port;
const num_processes = config.numCPUs || require('os').cpus().length;
const workers = [];


if (cluster.isMaster) {

    console.log(`Skalia server started on ${port} port`);

    let i;

    const spawn = function (i) {
        workers[i] = cluster.fork();
        workers[i].on('exit', function (code, signal) {
            console.log('respawning worker', i);
            spawn(i);
        });
    };

    // Spawn workers.
    for (i = 0; i < num_processes; i++) {
        spawn(i);
    }

    // Helper function for getting a worker index based on IP address.
    // This is a hot path so it should be really fast. The way it works
    // is by converting the IP address to a number by removing non numeric
    // characters, then compressing it to the number of slots we have.
    //
    // Compared against "real" hashing (from the sticky-session code) and
    // "real" IP number conversion, this function is on par in terms of
    // worker index distribution only much faster.
    const worker_index = function (ip, len) {
        return farmhash.fingerprint32(ip[i]) % len; // Farmhash is the fastest and works with IPv6, too
    };

    // Create the outside facing server listening on our port.
    const server = net.createServer({pauseOnConnect: true}, function (connection) {
        // We received a connection and need to pass it to the appropriate
        // worker. Get the worker for this connection's source IP and pass
        // it the connection.
        const worker = workers[worker_index(connection.remoteAddress, num_processes)];
        worker.send('sticky-session:connection', connection);
    }).listen(port);
} else {
    // Note we don't use a port here because the master listens on it for us.
    const app = new express();

    app.use(helmet.hidePoweredBy({setTo: 'PHP 5.2.0'}));  // hidePoweredBy to remove the X-Powered-By header
    app.use(helmet.hsts({maxAge: 7776000000}));           // hsts for HTTP Strict Transport Security
    app.use(helmet.ieNoOpen());                             // ieNoOpen sets X-Download-Options for IE8+
    app.use(helmet.noCache());                              // noCache to disable client-side caching
    app.use(helmet.noSniff());                              // noSniff to keep clients from sniffing the MIME type
    app.use(helmet.frameguard());                           // frameguard to prevent clickjacking
    app.use(helmet.xssFilter());                            // xssFilter adds some small XSS protections
    app.use(compression());
    app.use(bodyParser.urlencoded({extended: false}));
    app.use(bodyParser.json({limit: '10mb'}));
    app.use(methodOverride());
    app.use(cookieParser());
    app.use(cors());

    require(__dirname + '/routes')(app);

    // Don't expose our internal server to the outside.
    const server = app.listen(0, 'localhost');
    const io = sio(server);

    server.listen(port, config.app.ip, () => {
        console.log(`API Skalia server worker ${cluster.worker.id} up on ${port}`);
        require(__dirname + '/sockets')(io);
    });

    // Tell Socket.IO to use the redis adapter. By default, the redis
    // server is assumed to be on localhost:6379. You don't have to
    // specify them explicitly unless you want to change them.
    //TODO añadir el redis en el socket io
    //io.adapter(sio_redis({ host: 'localhost', port: 6379 }));

    //TODO MIRAR COMO HACER EL HANDLER DE LOS MENSAJES
    // Here you might use Socket.IO middleware for authorization etc.

    // Listen to messages sent from the master. Ignore everything else. API + Sockets
    process.on('message', function (message, connection) {
        if (message !== 'sticky-session:connection') {
            return;
        }

        // Emulate a connection event on the server by emitting the
        // event with the connection the master sent us.
        server.emit('connection', connection);

        connection.resume();
    });
}