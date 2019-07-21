"use strict";

class ReceivedNfeHandler {


    constructor(apiConsumer, nfeParser) {
        this.apiConsumer = apiConsumer;
        this.nfeParser = nfeParser;
    }

    startProcess() {
        this.apiConsumer.retrieveNfes(this._handleApiCallback);
    }

    _handleApiCallback(bodyResponse) {

        for (let i = 0; i < bodyResponse.count; i++) {
            let total = this.nfeParser.parseNfeToObject(bodyResponse.data[i].xml);
        }

    }
}

module.exports.ReceivedNfeHandler = ReceivedNfeHandler;