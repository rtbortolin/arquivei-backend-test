let apiKey = '';
let apiId = '';


let retrieveNfes = () => {
    fetch('https://apiuat.arquivei.com.br/v1/nfe/received');
};

let getApiKeys = () => {
    apiKey = process.env.ARQUIVEI_API_KEY;
    if (apiKey === undefined)
        throw new Error('`ARQUIVEI_API_KEY` not set on environment variable');

    apiId = process.env.ARQUIVEI_API_ID;
    if (!apiId)
        throw new Error('`ARQUIVEI_API_ID` not set on environment variable');
}

getApiKeys();

module.exports = {
    retrieveNfes: retrieveNfes
}