const fs = require('fs');
const expect = require('chai').expect;
const inst = require('../../src/services/nfe-parser-service');

describe('nfe-parser-service', function () {
    let mockDataList = [];
    before(function () {
        let rawdata = fs.readFileSync("./tests/mock-data/base64data.json");
        mockDataList = JSON.parse(rawdata);
    });

    describe('Smoke tests', function () {
        it('tests mock data should not be empty', function () {
            expect(mockDataList).to.be.not.empty;
        });

        it('should exist the service lib', function () {
            expect(inst).to.exist;
        });

        it("should exist the method 'convertBase64ToText'", function () {
            expect(inst.convertBase64ToText).to.exist;
            expect(inst.convertBase64ToText).to.be.a('function');
        });
    });

    describe('convertBase64ToText', function () {

        it('should return a text from base 64 inputs', function () {

            for (let mockData of mockDataList) {
                //arrange
                var base64Input = mockData;

                //action
                let convertedText = inst.convertBase64ToText(base64Input.base64);

                //assert 
                expect(convertedText).to.exist;
                expect(convertedText).to.be.equal(base64Input.text);
            }
        });

    });
});