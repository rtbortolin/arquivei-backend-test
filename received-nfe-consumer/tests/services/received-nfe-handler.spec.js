const chai = require('chai');
const expect = chai.expect
const sinon = require('sinon');
const sinonChai = require('sinon-chai');
chai.use(sinonChai);

global.fetch = require('node-fetch');
global.originalFetch = global.fetch;

const ReceivedNfeHandler = require('../../src/services/received-nfe-handler').ReceivedNfeHandler;
const apiConsumer = require('../../src/services/arquivei-api-consumer');
const nfeParser = require('../../src/services/nfe-parser-service');

const apiMockHelper = require('./api-mock-helper');

describe('received-nfe-handler tests', () => {

    let stubedApiConsumerRetrieveNfes;
    let spyHandleApiCallback;

    let inst;
    beforeEach(() => {
        inst = new ReceivedNfeHandler();

        stubedApiConsumerRetrieveNfes = sinon.stub(apiConsumer, 'retrieveNfes');

        spyHandleApiCallback = sinon.spy(inst, '_handleApiCallback');
    });
    afterEach(() => {
        stubedApiConsumerRetrieveNfes.restore();
        spyHandleApiCallback.restore();
    });

    describe('Smoke tests', () => {
        it('should exist the method `startProcess`', () => {
            expect(inst.startProcess).to.exist;
            expect(inst.startProcess).to.be.a('function');
        });

        it('should exist the method `_handleApiCallback`', () => {
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

        it('Should pass a callback for response callback', async () => {
            inst.startProcess();

            expect(stubedApiConsumerRetrieveNfes).to.have.been.calledOnce;
            expect(stubedApiConsumerRetrieveNfes).to.have.been.calledWith;
        });
    });

    describe('_handleApiCallback', () => {

        let spyParser;
        let apiResponseMock;
        let spyNfeRepository;

        let inst;

        beforeEach(() => {
            spyParser = sinon.spy(nfeParser, 'parseNfeToObject');

            let nfeRepository = { save: function () { } };
            spyNfeRepository = sinon.spy(nfeRepository, 'save');

            inst = new ReceivedNfeHandler(apiConsumer, nfeParser, nfeRepository);
        });

        afterEach(() => {
            spyParser.restore();
        });

        before(() => {
            apiResponseMock = apiMockHelper.loadResponseMock(1);
        });

        it('Should call parser to get nfe content', () => {

            inst._handleApiCallback(apiResponseMock);

            expect(spyParser).to.have.been.called;
        });

        it('Should call parser for each nfe on body page', async () => {

            await inst._handleApiCallback(apiResponseMock);

            expect(spyParser).to.have.been.callCount(5);
        });

        it('Should call persistence api for each nfe', async () => {
            await inst._handleApiCallback(apiResponseMock);

            expect(spyNfeRepository).to.have.been.called;
        });
    });
});