const pug = require('pug');

module.exports = files => {
    return pug.renderFile('page.pug', {
        files
    });
}