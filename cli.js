const startServer = require('./server');

function run(cmd) {
    console.log(cmd);
    switch (cmd) {
        case 'server':
            startServer()
            break;
        default:

    }
}

module.exports = run;
