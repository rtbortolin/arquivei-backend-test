const fs = require('fs');
const chai = require('chai');
const expect = chai.expect
const rewire = require('rewire');
const inst = rewire('../../src/services/nfe-parser-service');

chai.use(require('chai-asserttype'));

describe('nfe-parser-service', () => {
    let mockDataList = [];

    let instConvertBase64ToText = inst.__get__('convertBase64ToText');
    let instConvertXMLtoJson = inst.__get__('convertXMLtoJson');
    let instGetTotalNfeValue = inst.__get__('getTotalNfeValue');
    
    before(() => {
        let rawdata = fs.readFileSync("./tests/mock-data/base64data.json");
        mockDataList = JSON.parse(rawdata);
    });

    describe('Smoke tests', () => {
        it('tests mock data should not be empty', () => {
            expect(mockDataList).to.be.not.empty;
        });

        it('should exist the service lib', () => {
            expect(inst).to.exist;
        });

        it("should exist the method 'convertBase64ToText'", () => {
            expect(instConvertBase64ToText).to.exist;
            expect(instConvertBase64ToText).to.be.a('function');
        });

        it("should exist the method 'convertXMLtoJson'", () => {
            expect(instConvertXMLtoJson).to.exist;
            expect(instConvertXMLtoJson).to.be.a('function');
        });

        it("should exist the method 'getTotalNfeValue'", () => {
            expect(instGetTotalNfeValue).to.exist;
            expect(instGetTotalNfeValue).to.be.a('function');
        });

        it("should exist the method 'parseNfeToObject'", () => {
            expect(inst.parseNfeToObject).to.exist;
            expect(inst.parseNfeToObject).to.be.a('function');
        });

    });

    describe('convertBase64ToText', () => {

        it('should return a text from base 64 inputs', () => {

            for (let mockData of mockDataList) {
                //arrange
                var base64Input = mockData;

                //action
                let convertedText = instConvertBase64ToText(base64Input.base64);

                //assert 
                expect(convertedText).to.exist;
                expect(convertedText).to.be.equal(base64Input.text);
            }
        });

    });

    describe('convertXMLtoJson', () => {

        it('should convert a XML to Json format', async () => {
            let xml = '<root><child>Hello!</child></root>'

            let jsonObj = undefined;
            await instConvertXMLtoJson(xml).then((result) => {
                jsonObj = result;
            });

            expect(jsonObj).to.exist;
            expect(jsonObj).to.be.instanceOf(Object);
            expect(jsonObj.child).to.exist;
            expect(jsonObj.child).to.be.equal('Hello!');
        });

        it('should convert a XML nfe to Json format', async () => {
            for (let mockData of mockDataList) {
                let xml = mockData.text;

                let jsonObj = undefined;
                await instConvertXMLtoJson(xml).then((result) => {
                    jsonObj = result;
                });

                expect(jsonObj).to.exist;
                expect(jsonObj.NFe).to.exist;
                expect(jsonObj.NFe.infNFe).to.exist;
                expect(jsonObj.NFe.infNFe.total).to.exist;
                expect(jsonObj.NFe.infNFe.total.ICMSTot).to.exist;
                expect(jsonObj.NFe.infNFe.total.ICMSTot.vProd).to.exist;

                let vprod = parseFloat(jsonObj.NFe.infNFe.total.ICMSTot.vProd);
                expect(vprod).to.be.greaterThan(-1);
            }
        });
    });

    describe('getTotalNfeValue', () => {
        let nfeObj = {}
        before(() => {
            let rawdata = fs.readFileSync('./tests/mock-data/nfe-mock.json');
            nfeObj = JSON.parse(rawdata);
        });

        it('should return total value when a valid nfe json is provided', () => {

            let totalValue = instGetTotalNfeValue(nfeObj);

            expect(totalValue).to.exist;
            expect(totalValue).to.be.number();

            let value = parseFloat(totalValue);
            expect(value).to.be.equal(230.72);
        });

        it('should return -1 value when a invalid nfe json is provided', () => {
            var wrongNfeObj = {};
            let totalValue = instGetTotalNfeValue(wrongNfeObj);

            expect(totalValue).to.exist;
            expect(totalValue).to.be.number();

            let value = parseFloat(totalValue);
            expect(value).to.be.equal(-1);
        });

    });

    describe('parseNfeToObject', () => {
        it('should return value from base64 nfe', async () => {

            for (let mockData of mockDataList) {
                let base64 = mockData.base64;
                let value = mockData.totalValue;

                let expectedResult = {
                    xml: mockData.text,
                    total: value
                }

                var returnedValue = await inst.parseNfeToObject(base64);

                expect(returnedValue).to.exist;
                expect(returnedValue.xml).to.be.equal(expectedResult.xml);
                expect(returnedValue.total).to.be.equal(expectedResult.total);
            }

        });
    });
});