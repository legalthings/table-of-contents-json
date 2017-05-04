const chai = require('chai');
const TOC = require('../../../../src/table-of-contents-json.js');

module.exports = () => {
  const html = `
    <html>
      <head>...</head>
      <body>
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

  const toc = new TOC();

  chai.expect(
    toc.generateJSON(html)
  ).to.deep.equal(json);
};
