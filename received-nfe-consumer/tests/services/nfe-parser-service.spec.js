const fs = require('fs');
const expect = require('chai').expect;
const inst = require('../../src/services/nfe-parser-service');

describe('nfe-parser-service', () => {
    let mockDataList = [];
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
            expect(inst.convertBase64ToText).to.exist;
            expect(inst.convertBase64ToText).to.be.a('function');
        });

        it("should exist the method 'convertXMLtoJson'", () => {
            expect(inst.convertXMLtoJson).to.exist;
            expect(inst.convertXMLtoJson).to.be.a('function');
        });

        it("should exist the method 'getTotalNfeValue'", () => {
            expect(inst.getTotalNfeValue).to.exist;
            expect(inst.getTotalNfeValue).to.be.a('function');
        });
    });

    describe('convertBase64ToText', () => {

        it('should return a text from base 64 inputs', () => {

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

    describe('convertXMLtoJson', () => {

        it('should convert a XML to Json format', async () => {
            let xml = '<root><child>Hello!</child></root>'

            let jsonObj = undefined;
            await inst.convertXMLtoJson(xml).then((result) => {
                jsonObj = result;
            });

            expect(jsonObj).to.exist;
            expect(jsonObj).to.be.instanceOf(Object);
            expect(jsonObj.root).to.exist;
            expect(jsonObj.root.child).to.exist;
            expect(jsonObj.root.child).to.be.equal('Hello!');
        });

        it('should convert a XML nfe to Json format', async () => {
            let xml = mockDataList[0].text;

            let jsonObj = undefined;
            await inst.convertXMLtoJson(xml).then((result) => {
                jsonObj = result;
            });

            expect(jsonObj).to.exist;
            expect(jsonObj.nfeProc).to.exist;
            expect(jsonObj.nfeProc.NFe).to.exist;
            expect(jsonObj.nfeProc.NFe.infNFe).to.exist;
            expect(jsonObj.nfeProc.NFe.infNFe.total).to.exist;
            expect(jsonObj.nfeProc.NFe.infNFe.total.ICMSTot).to.exist;
            expect(jsonObj.nfeProc.NFe.infNFe.total.ICMSTot.vProd).to.exist;
            expect(jsonObj.nfeProc.NFe.infNFe.total.ICMSTot.vProd).to.be.equal('230.72');
        });
    });

    describe('getTotalNfeValue', () => {
        before(() => {

        });

        it('should return total value when a valid nfe json is provided', () => {

        });

    });
});