function getExt(file) {
    file = file || '';
    var match = file.match(/\.[^\.]+$/);
    return match && match[0] || '';
}
module.exports = path => {
    const type = getExt(path);

    switch (type) {
        case '.js':
            return 'application/javascript';
        case '.css':
            return 'text/css';
        default:
            return 'text/html';
    }
}