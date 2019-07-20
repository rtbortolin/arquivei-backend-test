const chai = require('chai');
const expect = chai.expect
const sinon = require('sinon');
const sinonChai = require('sinon-chai');
const sinonStubPromise = require('sinon-stub-promise');

global.fetch = require('node-fetch');
const fetchedStub = sinon.stub(global, 'fetch');

const rewire = require('rewire');
const inst = rewire('../../src/services/arquivei-api-consumer');

chai.use(sinonChai);
sinonStubPromise(sinon);

describe('arquivei-api-consumer', () => {

    let instGetApiKeys = inst.__get__('getApiKeys');

    afterEach(() => {
        fetchedStub.restore();
    })

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

        it('should call fetch function', () => {

            inst.retrieveNfes();

            expect(fetchedStub).to.have.been.calledOnce;
        });

        it('should call fetch with correct url', () => {

            inst.retrieveNfes();

            expect(fetchedStub).to.have.been.calledWith('https://apiuat.arquivei.com.br/v1/nfe/received');
        });
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