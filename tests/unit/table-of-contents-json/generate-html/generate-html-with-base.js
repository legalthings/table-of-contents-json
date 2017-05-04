const assert = require('assert');
const minify = require('html-minifier').minify;
const TOC = require('../../../../src/table-of-contents-json.js');

module.exports = () => {
  const html = `
    <html>
      <head>
        <foo></foo>
        <style>
          #toc li,ol,ul { list-style: none; }
        </style>
      </head>
      <body>
        <div>
          <h1>Table of Contents</h1>
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
  `;

  const json = [
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
  ];

  const base = `
    <html>
      <head>
        <foo></foo>
      </head>
      <body><div>[ table of contents ]</div></body>
    </html>
  `;

  const toc = new TOC();

  assert.equal(
    toc.generateHTML(json, base, {tocHeader: 'Table of Contents'}),
    minify(html, {collapseWhitespace: true})
  );
};
