'use strict';

const assert = require('assert');
const chai = require('chai');
const TOC = require('../../../src/table-of-contents-json.js');
const toc = new TOC();
const htmlDocuments = require('../../data/documents/html');

describe('TableOfContentsJSON', () => {
    describe('#generate()', () => {
        it('should generate a nested JSON TOC structure', testGenerateNestedStructure);
        it('should throw exception if invalid html is given', tesGenerateInvalidTypeException);
    });
});

function testGenerateNestedStructure () {
    chai.expect(toc.generate(htmlDocuments[0])).to.deep.equal([
        {
            "id": 0,
            "name": "Paragraph 1",
            "type": "h1",
            "children": [
                {
                    "id": 1,
                    "name": "Paragraph 1.1",
                    "type": "h2",
                    "children": []
                }
            ]
        },
        {
            "id": 2,
            "name": "Paragraph 2",
            "type": "h1",
            "children": [
                {
                    "id": 3,
                    "name": "Paragraph 2.1",
                    "type": "h2",
                    "children": []
                },
                {
                    "id": 4,
                    "name": "Paragraph 2.2",
                    "type": "h2",
                    "children": [
                        {
                            "id": 5,
                            "name": "Paragraph 2.2.1",
                            "type": "h3",
                            "children": []
                        }
                    ]
                }
            ]
        }
    ]);
}

function tesGenerateInvalidTypeException () {
    chai.expect(() => toc.generate(15)).to.throw('html should be set and must be a string');
}
