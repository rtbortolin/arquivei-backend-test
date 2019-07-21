const parseString = require('xml2js').parseString;
const debug = require('debug')('received-nfe-consumer:nfe-parser-service');

var convertBase64ToText = (base64input) => {
    let buffer = new Buffer(base64input, 'base64');
    return buffer.toString('utf-8');
};

var convertXMLtoJson = (xml) => {
    return new Promise((resolve, reject) => {
        parseString(xml, { explicitArray: false, explicitRoot: false }, (err, result) => {
            if (result)
                resolve(result);
            else
                reject(err);
        });
    });
};

var getTotalNfeValue = (nfeObj) => {
    if (nfeObj === undefined) {
        debug('`nfeObj` is undefined');
        return -1;
    }
    if (nfeObj.NFe === undefined) {
        debug('`nfeObj.NFe` is undefined');
        return -1;
    }
    if (nfeObj.NFe.infNFe === undefined) {
        debug('`nfeObj.NFe.infNFe` is undefined');
        return -1;
    }
    if (nfeObj.NFe.infNFe.total === undefined) {
        debug('`nfeObj.NFe.infNFe.total` is undefined');
        return -1;
    }
    if (nfeObj.NFe.infNFe.total.ICMSTot === undefined) {
        debug('`nfeObj.NFe.infNFe.total.ICMSTot` is undefined');
        return -1;
    }
    if (nfeObj.NFe.infNFe.total.ICMSTot.vProd === undefined) {
        debug('`nfeObj.NFe.infNFe.total.ICMSTot.vProd` is undefined');
        return -1;
    }
    return parseFloat(nfeObj.NFe.infNFe.total.ICMSTot.vProd);
};

var parseNfeToObject = async (base64input) => {
    let xml = convertBase64ToText(base64input);
    let nfeObj = await convertXMLtoJson(xml);
    let total = getTotalNfeValue(nfeObj);
    return {
        xml: xml,
        total: total
    }
}

module.exports = {
    parseNfeToObject: parseNfeToObject
}