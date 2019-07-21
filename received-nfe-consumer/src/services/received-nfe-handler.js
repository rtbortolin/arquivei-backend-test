"use strict";

class ReceivedNfeHandler {

    constructor(apiConsumer, nfeParser, nfeRepository) {
        this.apiConsumer = apiConsumer;
        this.nfeParser = nfeParser;
        this.nfeRepository = nfeRepository;
    }

    async startProcess() {
        let self = this;
        let callback = (bodyResponse) => {
            self._handleApiCallback(bodyResponse);
        }
        await this.apiConsumer.retrieveNfes(callback);
    }

    async _handleApiCallback(bodyResponse) {
        
        for (let i = 0; i < bodyResponse.count; i++) {
            let nfeData = bodyResponse.data[i];
            let nfe = await this.nfeParser.parseNfeToObject(nfeData.xml);
            nfe.access_key = nfeData.access_key;

            this._saveNfe(nfe);
        }

    };

    _saveNfe(nfe) {
        this.nfeRepository.save(nfe);
    }
}

module.exports.ReceivedNfeHandler = ReceivedNfeHandler;