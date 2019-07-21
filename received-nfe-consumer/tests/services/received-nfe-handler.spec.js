const fs = require('fs');
const chai = require('chai');
const expect = chai.expect
const sinon = require('sinon');
const sinonChai = require('sinon-chai');
chai.use(sinonChai);

global.fetch = require('node-fetch');
global.originalFetch = global.fetch;
let fetchedStub = sinon.stub(global, 'fetch');

const rewire = require('rewire');
const ReceivedNfeHandler = require('../../src/services/received-nfe-handler').ReceivedNfeHandler;
const apiConsumer = require('../../src/services/arquivei-api-consumer');
const nfeParser = require('../../src/services/nfe-parser-service');

const apiMockHelper = require('./api-mock-helper');

describe('received-nfe-handler tests', () => {

    let stubedApiConsumerRetrieveNfes;
    beforeEach(() => {
        stubedApiConsumerRetrieveNfes = sinon.stub(apiConsumer, 'retrieveNfes');
    });
    afterEach(() => {
        stubedApiConsumerRetrieveNfes.restore();
    });

    describe('Smoke tests', () => {
        it('should exist the method `startProcess`', () => {
            let inst = new ReceivedNfeHandler();

            expect(inst.startProcess).to.exist;
            expect(inst.startProcess).to.be.a('function');
        });

        it('should exist the method `_handleApiCallback`', () => {
            let inst = new ReceivedNfeHandler();

            expect(inst._handleApiCallback).to.exist;
            expect(inst._handleApiCallback).to.be.a('function');
        });
    });

    describe('start process', () => {
        let inst;

        beforeEach(() => {
            inst = new ReceivedNfeHandler(apiConsumer, nfeParser);
        });

        it('Should call arquivei api consumer', () => {

            inst.startProcess();

            expect(stubedApiConsumerRetrieveNfes).to.have.been.calledOnce;
        });

        it('Should pass _handleApiCallback for response callback', async () => {
            inst.startProcess();

            expect(stubedApiConsumerRetrieveNfes).to.have.been.calledOnce;
            expect(stubedApiConsumerRetrieveNfes).to.have.been.calledWith(inst._handleApiCallback);
        });
    });

    describe('_handleApiCallback', () => {

        let spyParser;
        let apiResponseMock;

        beforeEach(() => {
            spyParser = sinon.spy(nfeParser, 'parseNfeToObject');
        });

        afterEach(() => {
            spyParser.restore();
        });

        before(() => {
            apiResponseMock = apiMockHelper.loadResponseMock(1);
        });

        it('Should call parser to get nfe content', () => {
            let inst = new ReceivedNfeHandler(apiConsumer, nfeParser);

            inst._handleApiCallback(apiResponseMock);

            expect(spyParser).to.have.been.called;
        });

        it('Should call parser for each nfe on body page', () => {
            let inst = new ReceivedNfeHandler(apiConsumer, nfeParser);

            inst._handleApiCallback(apiResponseMock);

            expect(spyParser).to.have.been.callCount(5);
        });
    });
});