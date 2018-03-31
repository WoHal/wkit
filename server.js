const path = require('path');
const fs = require('fs');
const JSON5 = require('json5');
const Koa = require('koa');
const app = new Koa();
const webpack = require('webpack');
const middleware = require('koa-webpack-dev-middleware');
const webpackConfig = require('./webpack.config');
const merge = require('webpack-merge');

const pageRender = require('./page');
const getContentType = require('./contentType');

function initConfig() {
    if (fs.existsSync(path.join(__dirname, 'config.js'))) {
        const config = fs.readFileSync(path.join(__dirname, 'config.js'));
        try {
            return JSON5.parse(config);
        } catch(e) {
            throw new Error('配置文件格式不正确');
        }
    }
    return {
        entry: {
            index: 'src/index.js'
        }
    };
}

function autoindex(filepath) {
    const curDir = path.join(__dirname, filepath);
    if (fs.existsSync(curDir)) {
        const stats = fs.statSync(curDir);
        if (stats.isFile()) {
            return {
                status: 200,
                content: fs.readFileSync(curDir)
            };
        } else if (stats.isDirectory()) {
            filepath += filepath === '/' ? '' : '/';
            const files = fs.readdirSync(curDir).map(filename => {
                return `${filepath}${filename}`.slice(1);
            });
            return {
                status: 200,
                content: pageRender(files)
            };
        }
    }
    return {
        status: 404,
        content: ''
    };
}

function start(port) {
    let entry = {};
    let serverConfig = initConfig();
    console.log(serverConfig)
    // serverConfig.entry.forEach(item => {
    //     entry[path.join(__dirname, 'dist/' + item).replace(/\.(js|s?css)$/i, '')] = path.join(__dirname, item);
    // });
    // serverConfig.entry = entry;

    // const config = merge(serverConfig, webpackConfig);
    // const compiler = webpack(config);

    // app.use(middleware(compiler));
    app.use(async (ctx, next) => {
        const {request, response} = ctx;
        const {url} = request;
        const {status, content} = autoindex(url);

        response.set('Content-Type', getContentType(url));
        response.status = status;
        response.body = content;

        console.log(`Status: ${status} --- ${url}`);

        next();
    });

    app.listen(port || 3000);
}

start();
module.exports = start;
