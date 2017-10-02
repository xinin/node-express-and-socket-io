'use strict';

const express = require('express');
const compression = require('compression');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');
const App = require(__dirname+'/index');
// const Utils = App.Utils();
const config = App.Config();
const setup = require(__dirname+'/setup');
const cluster = require('cluster');
const numCPUs = require('os').cpus().length;

// Creamos app de express
const app = express();
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
// Utils.sanitize(app);
// Utils.setMorgan(app);
// Utils.setMiddleware(app);
setup.once('success',() => {

    // Multihilo
    if (cluster.isMaster) {
        for (let i = 0; i < numCPUs; i++) {
            cluster.fork();
        }

        let maxWorkerCrashes = config.security.restart;
        cluster.on('exit', (worker, code, signal) => {
            App.log().info(false,'worker ' + worker.process.pid + ' died');
            if (worker.suicide !== true) {
                maxWorkerCrashes--;
                if (maxWorkerCrashes <= 0) {
                    // App.log().error(false,{ msg : 'Too many worker crashes -> process exit', code : 500, alert : 'system' },true);
                    console.log('Too many worker crashes -> process exit');
                } else {
                    cluster.fork();
                }
            }
        });

    } else {

        try {
            require(__dirname+'/routes')(app);
            let server = require('http').createServer(app);
            server.listen(config.app.port, config.app.ip, () => {
                // App.log().info(false,'Skalia server listening on port '+config.app.port+', env '+app.get('env'));
                console.log('API Skalia server listening on port '+config.app.port);
            });

        } catch (err) {
            //App.log().error(false,{ msg : 'Error arrancando servidor: '+(err.stack || JSON.stringify(err)), code : 500, alert : 'system' },true);
            console.log('Error arrancando servidor: '+(err.stack || JSON.stringify(err)))
        }
    }
}).on('error',(err, data) => {
    //App.log().error(false, { msg : 'Error en el setup del servidor: '+JSON.stringify(err), code : 500 , alert : 'system' },true);
    console.log(err, data);
    console.log('Error en el setup del servidor: '+JSON.stringify(err))
});

process.on('uncaughtException', (err) => {
    console.log('Excepción: ',err);
    if(err instanceof Error) {
        //App.log().error(false, { msg : 'Excepción en el servidor: ' + err.toString() + 'en : ' + err.stack, code : 500 , alert : 'system' });
        console.log('Excepción en el servidor: ' + err.toString() + 'en : ' + err.stack);
        console.log(err.stack);
    } else {
        App.log().error(false, { msg : 'Excepción en el servidor: ' + JSON.stringify(err), code : 500 , alert : 'system' });
    }
});

process.on('unhandledRejection', err => {
    console.log('unhandledRejection: ',err);
    if(err instanceof Error) {
        //App.log().error(false, { msg : 'unhandledRejection en el servidor: ' + err.toString() + 'en : ' + err.stack, code : 500 , alert : 'system' });
        console.log('unhandledRejection en el servidor: ' + err.toString() + 'en : ' + err.stack);
        console.log(err.stack);
    } else {
        console.log('unhandledRejection en el servidor: ' + JSON.stringify(err));
        //App.log().error(false, { msg : 'unhandledRejection en el servidor: ' + JSON.stringify(err), code : 500 , alert : 'system' });
    }
});

// Expose app
module.exports = app;
