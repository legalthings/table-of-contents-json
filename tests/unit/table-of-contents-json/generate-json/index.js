module.exports = () => {
  it('should generate a json toc structure', require('./generate-json'));
  it('should generate a json toc and skip headers', require('./generate-json-skip-header'));
  it('should throw exception for generate json if invalid html is given', require('./generate-json-invalid-html-exception'));
};
