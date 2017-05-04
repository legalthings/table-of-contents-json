const chai = require('chai');
const TOC = require('../../../../src/table-of-contents-json.js');

module.exports = () => {
  const toc = new TOC();

  chai.expect(
    () => toc.generateJSON()
  ).to.throw('html should be set and must be a string');
};
