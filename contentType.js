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
        case '.jpg':
        case '.jpeg':
        case '.svg':
        case '.png':
        case '.gif':
            return 'image/*';
        default:
            return 'text/html';
    }
}