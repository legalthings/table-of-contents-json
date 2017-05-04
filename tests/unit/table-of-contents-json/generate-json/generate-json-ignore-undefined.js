const chai = require('chai');
const TOC = require('../../../../src/table-of-contents-json.js');

module.exports = () => {
  const html =`
    <html>
      <head>...</head>
      <body>
        <h3>Ignored because not nested under parent</h3>

        <h1>
          Example header
        </h1>

        <!-- these should be ignored as they render empty headers -->
        <h1>      </h1>
        <h1>&nbsp;</h1>
        <h1>&#xA0;</h1>

        <!-- since headers most likely will not contain tables and such, we should grab any text in it, even if it is nested -->
        <h1>
          <strong>No immediate content header</strong>
          <strong>Not the first child so is ignored</strong>
        </h1>
      </body>
    </html>
  `;

  const json = [
    {
      "children": [],
      "id": 1,
      "name": "Example header",
      "type": "h1"
    },
    {
      "children": [],
      "id": 5,
      "name": "No immediate content header",
      "type": "h1"
    }
  ];

  const toc = new TOC();

  chai.expect(
    toc.generateJSON(html)
  ).to.deep.equal(json);
};
