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
const inst = rewire('../../src/services/arquivei-api-consumer');

const getApiKeysName = 'getApiKeys';

describe('arquivei-api-consumer', () => {

    let instGetApiKeys = inst.__get__(getApiKeysName);

    let promise;

    describe('Smoke tests', () => {

        it('Should exist the instance of service', () => {
            expect(inst).to.exist;
        });

        it('should exist the method `retrieveNfes`', () => {
            expect(inst.retrieveNfes).to.exist;
            expect(inst.retrieveNfes).to.be.a('function');
        });

        it('should exist the method `getApiKeys`', () => {
            expect(instGetApiKeys).to.exist;
            expect(instGetApiKeys).to.be.a('function');
        });
    });

    describe('retrieveNfes', () => {

        let originalGetApiKeys;
        let stubedGetApiKeys;
        beforeEach(() => {
            promise = fetchedStub.returns(new Promise((resp, reason) => { }));

            stubedGetApiKeys = sinon.stub();
            originalGetApiKeys = inst.__get__(getApiKeysName);
            inst.__set__(getApiKeysName, stubedGetApiKeys);
        });

        afterEach(() => {
            fetchedStub.reset();
            fetchedStub.restore();

            inst.__set__(getApiKeysName, originalGetApiKeys);
        });

        it('should call fetch function', () => {
            inst.retrieveNfes();

            expect(fetchedStub).to.have.been.calledOnce;
        });

        it('should call fetch with correct url', () => {
            inst.retrieveNfes();

            expect(fetchedStub).to.have.been.calledOnce;
            expect(fetchedStub).to.have.been.calledWith('https://apiuat.arquivei.com.br/v1/nfe/received?limit=5&cursor=0');
        });

        it('should call callback function for each returned page', async () => {
            let callback = sinon.stub();
            let arquiveiResponseMock1 = loadResponseMock(1);
            let arquiveiResponseMock2 = loadResponseMock(2);
            let arquiveiResponseMock3 = loadResponseMock(3);

            let startUrl = 'https://apiuat.arquivei.com.br/v1/nfe/received?limit=5&cursor=0';
            promise.withArgs(startUrl).resolves(arquiveiResponseMock1);
            promise.withArgs(arquiveiResponseMock1.page.next).resolves(arquiveiResponseMock2);
            promise.withArgs(arquiveiResponseMock2.page.next).resolves(arquiveiResponseMock3);

            await inst.retrieveNfes(callback);

            expect(callback).to.have.been.calledThrice;
            expect(callback).to.have.been.calledWith(arquiveiResponseMock1);
            expect(callback).to.have.been.calledWith(arquiveiResponseMock2);
            expect(callback).to.have.been.calledWith(arquiveiResponseMock3);
        });

        loadResponseMock = (page) => {
            let arquiveiResponseMock = JSON.parse(fs.readFileSync(`./tests/mock-data/api-arquivei-response-mock-page-${page}.json`));
            arquiveiResponseMock.json = () => { return arquiveiResponseMock; };
            return arquiveiResponseMock;
        }
    });

    describe('getApiKeys', () => {

        it('should throw error if api-key is not set on environment variable', () => {
            delete process.env.ARQUIVEI_API_KEY;

            expect(instGetApiKeys).to.throw('`ARQUIVEI_API_KEY` not set on environment variable');

            try {
                instGetApiKeys();
            } catch (err) {
                expect(err).to.be.instanceOf(Error);
            }
        });

        it('should not throw error if api-key is set on environment variable', () => {
            process.env.ARQUIVEI_API_KEY = 'aaa'

            expect(instGetApiKeys).to.not.throw('`ARQUIVEI_API_KEY` not set on environment variable');

            try {
                instGetApiKeys();
            } catch (err) {
                expect(err).to.be.instanceOf(Error);
            }
        });

        it('should throw error if api-id is not set on environment variable', () => {
            delete process.env.ARQUIVEI_API_ID;

            expect(instGetApiKeys).to.throw('`ARQUIVEI_API_ID` not set on environment variable');

            try {
                instGetApiKeys();
            } catch (err) {
                expect(err).to.be.instanceOf(Error);
            }
        });

        it('should not throw error if api-id is set on environment variable', () => {
            process.env.ARQUIVEI_API_ID = 'aaa'

            expect(instGetApiKeys).to.not.throw('`ARQUIVEI_API_ID` not set on environment variable');

            try {
                instGetApiKeys();
            } catch (err) {
                expect(err).to.be.instanceOf(Error);
            }
        });
    });
});