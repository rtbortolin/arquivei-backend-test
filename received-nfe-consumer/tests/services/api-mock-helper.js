const fs = require('fs');

module.exports = {
    loadResponseMock: (page) => {
        let arquiveiResponseMock = JSON.parse(fs.readFileSync(`./tests/mock-data/api-arquivei-response-mock-page-${page}.json`));
        arquiveiResponseMock.json = () => { return arquiveiResponseMock; };
        return arquiveiResponseMock;
    }
}