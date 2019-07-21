const fs = require('fs');

let loadResponseMock = (page) => {
    return _loadAndPrepareResponseJson(`./tests/mock-data/api-arquivei-response-mock-page-${page}.json`);
};

let loadUnauthorizedResponseMock = () => {
    return _loadAndPrepareResponseJson(`./tests/mock-data/api-arquivei-response-unauthorized.json`);
};

let _loadAndPrepareResponseJson = (filename) => {
    let arquiveiResponseMock = JSON.parse(fs.readFileSync(filename));
    arquiveiResponseMock.json = () => { return arquiveiResponseMock; };
    return arquiveiResponseMock;
};

module.exports = {
    loadResponseMock: loadResponseMock,
    loadUnauthorizedResponseMock: loadUnauthorizedResponseMock
}