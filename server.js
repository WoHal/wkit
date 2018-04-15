const path = require('path');
const fs = require('fs');
const JSON5 = require('json5');
const Koa = require('koa');
const app = new Koa();
const webpack = require('webpack');
const wdm = require('koa-webpack-dev-middleware');
const webpackConfig = require('./webpack.config');
const extend = require('extend');

const pageRender = require('./page');
const getContentType = require('./contentType');

function getConfig(pathDir) {
    const configPath = path.join(__dirname, pathDir, 'config.js');

    if (fs.existsSync(configPath)) {
        try {
            let config = require(configPath);

            for (let key in config.entry) {
                config.entry[key] = path.join(__dirname, pathDir, config.entry[key]);
            }
            return extend({}, webpackConfig, config);
        } catch(e) {
            throw new Error('配置文件格式不正确');
        }
    }
    return {
        entry: {
            'dist/index': 'src/index.js'
        },
        output: {
            path: path.relative(__dirname, '/'),
            filename: '[name].js'
        }
    };
}

function autoindex(filepath, ctx) {
    const curDir = path.join(__dirname, filepath);
    if (/\/dist\//.test(curDir)) {
        filepath = path.join(__dirname, filepath).slice(1).split(/\//);
        const content = filepath.reduce((res, item) => {
            return res[item];
        }, ctx.webpack.fileSystem.data) || 'file not found';
        return {
            status: 200,
            content: content.toString()
        };
    }
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
    
    app.use(async (ctx, next) => {
        const {request, response} = ctx;
        const {url} = request;
        request.url = url.replace(/@[^.]+/i, '');


        if (/\/dist\//.test(url)) {
            const projectName = url.match(/\/([^/]+)/)[1];
            const config = getConfig(projectName);
            console.log(config)
            const compiler = webpack(config);
            const middleware = wdm(compiler);
            await middleware(ctx, next);
        } else {
            await next();
        }

    });

    app.use(async (ctx, next) => {
        const {request, response} = ctx;
        const {url} = request;
        const {status, content} = autoindex(url, ctx);

        response.set('Content-Type', getContentType(url));
        response.status = status;
        response.body = content;

        await next();
    });

    app.listen(port || 3000);
}

start();
module.exports = start;
