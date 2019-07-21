const debug = require('debug')('received-nfe-consumer:parsed-nfe-repository');

module.exports = {
    save: (nfe) => {
        debug(nfe);
    }
}