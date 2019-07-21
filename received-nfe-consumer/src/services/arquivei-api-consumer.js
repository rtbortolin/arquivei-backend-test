const Headers = require('node-fetch').Headers;
const debug = require('debug')('received-nfe-consumer:arquivei-api-consumer');

let apiKey = '';
let apiId = '';
let pageSize = 5;

let retrieveNfes = async (resultCallback) => {

    getApiKeys();

    let startUrl = `https://apiuat.arquivei.com.br/v1/nfe/received?limit=${pageSize}&cursor=0`;

    let response = await handleApiCall(startUrl, resultCallback);

    while (response.count >= pageSize) {
        response = await handleApiCall(response.page.next, resultCallback);
    }

};

let handleApiCall = async (url, callbackPage) => {

    let headers = new Headers();
    headers.append('x-api-id', apiId);
    headers.append('x-api-key', apiKey);
    headers.append('Content-Type', 'application/json');

    var config = {
        method: 'GET',
        headers: headers
    };
    let responseBody = {};
    await fetch(url, config)
        .then(response => {
            return response.json();
        })
        .then(body => {
            if (callbackPage) {
                callbackPage(body);
            }
            responseBody = body;
        })
        .catch(reason => {
            debug("Error calling API", reason);
        });

    return responseBody;
}

let getApiKeys = () => {
    apiKey = process.env.ARQUIVEI_API_KEY;
    if (apiKey === undefined)
        throw new Error('`ARQUIVEI_API_KEY` not set on environment variable');

    apiId = process.env.ARQUIVEI_API_ID;
    if (!apiId)
        throw new Error('`ARQUIVEI_API_ID` not set on environment variable');

    pageSize = process.env.ARQUIVEI_API_PAGE_SIZE || 5;
}

module.exports = {
    retrieveNfes: retrieveNfes
}