const fs = require('fs');
const chai = require('chai');
const expect = chai.expect
const sinon = require('sinon');
const sinonChai = require('sinon-chai');
chai.use(sinonChai);

global.fetch = require('node-fetch');
global.originalFetch = global.fetch;
let stubFetch = sinon.stub(global, 'fetch');

const debug = require('debug')('received-nfe-consumer:parsed-nfe-repository-spec');

const rewire = require('rewire');
const nfeRepository = rewire('../../../src/services/repositories/parsed-nfe-repository');

const apiMockHelper = require('../api-mock-helper');

describe('parsed-nfe-repository', () => {
    describe('Smoke Tests', () => {
        it('should exists', () => {
            expect(nfeRepository).to.exist;
        });

        it('should exist the method `save`', () => {
            expect(nfeRepository.save).to.exist;
            expect(nfeRepository.save).to.be.a('function');
        });
    });

    describe('save', () => {

        let stubPromise;
        let nfeMock;

        beforeEach(() => {
            stubFetch.reset();
            stubFetch.restore();
            stubPromise = stubFetch.returns(new Promise((resp, reason) => { }));

            nfeMock = {
                access_key: "123",
                xml: "<xml>",
                total: 10.4
            }
        });

        afterEach(() => {
            stubFetch.restore();
        });

        it('Should call fetch to call viewer api', async () => {
            stubPromise.resolves();

            await nfeRepository.save(nfeMock);

            expect(stubFetch).to.have.been.calledOnce;
        });

        it('Should call fetch with environment variable value', async () => {

            for (let i = 0; i < 5; i++) {
                process.env.ARQUIVEI_VIEWER_API_URL = `http://localhost://808${i}`;
                stubPromise.resolves();

                await nfeRepository.save(nfeMock);

                expect(stubFetch).to.have.been.calledWith(process.env.ARQUIVEI_VIEWER_API_URL + '/api/nfe');
            }
        });

        it('Should be called with POST method', async () => {
            process.env.ARQUIVEI_VIEWER_API_URL = "http://localhost:8080"
            stubPromise.resolves();

            await nfeRepository.save(nfeMock);

            expect(stubFetch).to.have.been.calledWithMatch('http://localhost:8080/api/nfe', { method: "POST" });
        });
    });
});