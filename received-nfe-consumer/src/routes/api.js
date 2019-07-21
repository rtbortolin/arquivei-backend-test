var express = require('express');
var router = express.Router();

const apiConsumer = require('../services/arquivei-api-consumer');
const nfeParser = require('../services/nfe-parser-service');
const nfeRepository = require('../services/repositories/parsed-nfe-repository');
const ReceivedNfeHandler = require('../services/received-nfe-handler').ReceivedNfeHandler;

/* GET users listing. */
router.get('/worker', function (req, res, next) {
    let nfeHandler = new ReceivedNfeHandler(apiConsumer, nfeParser, nfeRepository);

    nfeHandler.startProcess();

    res.json({
        status: {
            code: 200,
            message: "Process is running!"
        },
        error: ""
    });
});

module.exports = router;
