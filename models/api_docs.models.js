const {readFile} = require('fs/promises');

function fetchAPIDocs() {
    return readFile(`${__dirname}/../endpoints.json`).then(file => {
        return JSON.parse(file);
    });
}

module.exports = fetchAPIDocs;