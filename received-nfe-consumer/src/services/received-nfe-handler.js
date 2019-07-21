"use strict";

class ReceivedNfeHandler {


    constructor(apiConsumer, nfeParser, nfeRepository) {
        this.apiConsumer = apiConsumer;
        this.nfeParser = nfeParser;
        this.nfeRepository = nfeRepository;
    }

    startProcess() {
        this.apiConsumer.retrieveNfes(this._handleApiCallback);
    }

    _handleApiCallback(bodyResponse) {

        for (let i = 0; i < bodyResponse.count; i++) {
            let nfeData = bodyResponse.data[i];
            let nfe = this.nfeParser.parseNfeToObject(nfeData.xml);
            nfe.access_key = nfeData.access_key;

            this._saveNfe(nfe);
        }

    }

    _saveNfe(nfe) {
        this.nfeRepository.save(nfe);
    }
}

module.exports.ReceivedNfeHandler = ReceivedNfeHandler;