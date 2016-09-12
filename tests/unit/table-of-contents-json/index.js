'use strict';

const assert = require('assert');
const chai = require('chai');
const minify = require('html-minifier').minify;
const TOC = require('../../../src/table-of-contents-json.js');
const toc = new TOC();
const htmlDocuments = require('../../data/documents/html');
const jsonDocuments = require('../../data/documents/json');

describe('TableOfContentsJSON', () => {
    describe('#generateJSON()', () => {
        it('should generate a JSON TOC structure', testGenerateJSONStructure);
        it('should throw exception if invalid html is given', testGenerateInvalidHtmlException);
    });

    describe('#generateHTML()', () => {
        it('should generate a html TOC structure', testGenerateHTMLStructure);
        it('should generate a html TOC structure and put it in a base html', testGenerateHTMLStructureWithBase);
        it('should throw exception if invalid json is given', testGenerateInvalidJsonException);
    });
});

function testGenerateJSONStructure () {
    chai.expect(toc.generateJSON(htmlDocuments)).to.deep.equal([
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

function testGenerateInvalidHtmlException () {
    chai.expect(() => toc.generateJSON(15)).to.throw('html should be set and must be a string');
}

function testGenerateHTMLStructure () {
    assert.equal(toc.generateHTML(jsonDocuments), minify(`
        <html>
          <head>
            <style>
              #toc li,ol,ul { list-style: none; }
            </style>
          </head>
          <body>
            <ol id="toc">
              <li>
                Paragraph 1
                <ol>
                  <li>Paragraph 1.1</li>
                </ol>
              </li>
              <li>
                Paragraph 2
                <ol>
                  <li>Paragraph 2.1</li>
                  <li>
                    Paragraph 2.2
                    <ol>
                      <li>Paragraph 2.2.1</li>
                    </ol>
                  </li>
                </ol>
              </li>
            </ol>
          </body>
        </html>
    `, {
        collapseWhitespace: true
    }));
}

function testGenerateHTMLStructureWithBase () {
    let base = '<html><head><foo></foo><body><div>[ table of contents ]</div></body></head></html>';
    assert.equal(toc.generateHTML(jsonDocuments, base), minify(`
        <html>
          <head>
            <foo></foo>
            <style>
              #toc li,ol,ul { list-style: none; }
            </style>
          </head>
          <body>
            <div>
              <ol id="toc">
                <li>
                  Paragraph 1
                  <ol>
                    <li>Paragraph 1.1</li>
                  </ol>
                </li>
                <li>
                  Paragraph 2
                  <ol>
                    <li>Paragraph 2.1</li>
                    <li>
                      Paragraph 2.2
                      <ol>
                        <li>Paragraph 2.2.1</li>
                      </ol>
                    </li>
                  </ol>
                </li>
              </ol>
            </div>
          </body>
        </html>
    `, {
        collapseWhitespace: true
    }));
}

function testGenerateInvalidJsonException () {
    chai.expect(() => toc.generateJSON()).to.throw('html should be set and must be a string');
}
