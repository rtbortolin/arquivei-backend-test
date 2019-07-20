const parseString = require('xml2js').parseString;

module.exports = {
    convertBase64ToText: (base64input) => {
        let buffer = new Buffer(base64input, 'base64');
        return buffer.toString('utf-8');
    },

    convertXMLtoJson: (xml) => {
        return new Promise((resolve, reject) => {
            parseString(xml, { explicitArray: false }, (err, result) => {
                if (result)
                    resolve(result);
                else
                    reject(err);
            });
        });
    },

    getTotalNfeValue: (nfe) => {
        return nfe;
    }
}