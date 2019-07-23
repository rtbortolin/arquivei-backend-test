const Headers = require('node-fetch').Headers;
const debug = require('debug')('received-nfe-consumer:parsed-nfe-repository');

let apiUrl = '';

let save = async (nfe) => {
    debug(`Saving NFe with access_key = [${nfe.access_key}]`);
    _getApiParams();

    let headers = new Headers();
    headers.append('Content-Type', 'application/json');

    let nfeRequest = {
        accessKey: nfe.access_key,
        xml: nfe.xml,
        totalValue: nfe.total
    }

    var config = {
        method: 'POST',
        body: JSON.stringify(nfeRequest),
        headers: headers
    };

    let sucess = false;

    await fetch(apiUrl + '/api/nfe', config)
        .then((resp) => {
            if (resp.status == 201)
                sucess = true;
        }).catch((reason) => {
            debug(`Error saving NFe on viewer service.`, reason);
        });

    return sucess;
}

let _getApiParams = () => {
    apiUrl = process.env.ARQUIVEI_VIEWER_API_URL || 'http://localhost:8080';
}

module.exports = {
    save: save
}