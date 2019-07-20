module.exports = {
    convertBase64ToText: function (base64input) {
        let buffer = new Buffer(base64input, 'base64');
        return buffer.toString('utf-8');
    }
}