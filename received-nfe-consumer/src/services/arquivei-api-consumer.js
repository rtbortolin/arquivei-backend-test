const Headers = require('node-fetch').Headers;
const debug = require('debug')('received-nfe-consumer:arquivei-api-consumer');

let apiKey = '';
let apiId = '';
let pageSize = 5;

let retrieveNfes = async (resultCallback) => {

    getApiKeys();

    let apiUrl = `https://apiuat.arquivei.com.br/v1/nfe/received?limit=${pageSize}&cursor=0`;

    let response = {};
    let newResponse = response;
    let attempts = 0;
    let totalCount = 0;
    do {
        newResponse = await handleApiCall(apiUrl, resultCallback);
        if (newResponse.status) {
            if (newResponse.status.code) {
                if (newResponse.status.code != 200) {
                    debug("Error retrieving data from external api. Trying again!.");
                    response.count = pageSize;
                    attempts++;
                    if (attempts >= 5) {
                        debug(`More than 5 attempts to retrieve data from [${apiUrl}]. Canceling process!`);
                        break;
                    }
                } else {
                    response = newResponse;
                    apiUrl = response.page.next;
                    totalCount += parseInt(response.count);
                }
            }
        }
    } while (response.count >= pageSize);

    debug(`End NFe processing! Retrieved [${totalCount}] NFes.`);
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
            responseBody = body;
            if (body.status.code != 200) {
                debug(body);
                throw new Error(body.error);
            }
            if (callbackPage) {
                callbackPage(body);
            }
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