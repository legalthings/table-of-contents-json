const chai = require('chai');
const TOC = require('../../../../src/table-of-contents-json.js');

module.exports = () => {
  const html = `
    <html>
      <head>...</head>
      <body>
        <h1>Title Page</h1>
        <h1>Table of Contents</h1>
        <h1>Paragraph 1</h1>
        <h2>Paragraph 1.1</h2>
        <h1>Paragraph 2</h1>
        <h2>Paragraph 2.1</h2>
        <h2>Paragraph 2.2</h2>
        <h3>Paragraph 2.2.1</h3>
        <h4></h4>
      </body>
    </html>
  `;

  const json = [
    {
      "children": [
        {
          "children": [],
          "id": 3,
          "name": "Paragraph 1.1",
          "type": "h2"
        }
      ],
      "id": 2,
      "name": "Paragraph 1",
      "type": "h1"
    },
    {
      "children": [
        {
          "children": [],
          "id": 5,
          "name": "Paragraph 2.1",
          "type": "h2"
        },
        {
          "children": [
            {
              "children": [],
              "id": 7,
              "name": "Paragraph 2.2.1",
              "type": "h3"
            }
          ],
          "id": 6,
          "name": "Paragraph 2.2",
          "type": "h2"
        }
      ],
      "id": 4,
      "name": "Paragraph 2",
      "type": "h1"
    }
  ];

  const toc = new TOC();

  chai.expect(
    toc.generateJSON(html, {skipHeader: 2})
  ).to.deep.equal(json);
};
