const startServer = require('./server');

function run(cmd) {
    console.log(cmd);
    switch (cmd) {
        case 'start':
            startServer()
            break;
        default:

    }
}

module.exports = run;
